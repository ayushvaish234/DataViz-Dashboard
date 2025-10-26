from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import get_db
from models import Dataset, User
from jose import jwt, JWTError
from utils.jwt import SECRET_KEY, ALGORITHM
import os, shutil, pandas as pd, json

router = APIRouter(prefix="/datasets", tags=["datasets"])
UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/upload")
async def upload_dataset(file: UploadFile = File(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ext = file.filename.split(".")[-1].lower()
    if ext not in ("csv", "xls", "xlsx"):
        raise HTTPException(status_code=400, detail="Only csv/xls/xlsx allowed")
    fname = f"{current_user.id}_{int(pd.Timestamp.now().timestamp())}_{file.filename}"
    path = os.path.join(UPLOAD_DIR, fname)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    df = pd.read_csv(path) if ext == "csv" else pd.read_excel(path)
    cols = [{"name": c, "dtype": str(df[c].dtype)} for c in df.columns]
    ds = Dataset(user_id=current_user.id, filename=file.filename, filepath=path, columns=cols, rows_count=len(df))
    db.add(ds); db.commit(); db.refresh(ds)
    return {"dataset_id": ds.id, "columns": cols, "rows": len(df)}

@router.get("/{dataset_id}/data")
def get_data(dataset_id: int, skip: int = 0, limit: int = 50, filters: str = Query(None),
             current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    if ds.user_id != current_user.id and current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    df = pd.read_csv(ds.filepath) if ds.filepath.lower().endswith(".csv") else pd.read_excel(ds.filepath)
    if filters:
        try:
            f = json.loads(filters)
            for k, v in f.items():
                if v is None or v == "": continue
                df = df[df[k].astype(str).str.contains(str(v), case=False, na=False)]
        except Exception:
            pass
    total = len(df)
    subset = df.iloc[skip: skip + limit]
    return {"total": total, "rows": subset.to_dict(orient="records"), "columns": list(df.columns)}

@router.get("/{dataset_id}/chart")
def chart(dataset_id: int, x: str, y: str = None, agg: str = "count",
          current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    if ds.user_id != current_user.id and current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    df = pd.read_csv(ds.filepath) if ds.filepath.lower().endswith(".csv") else pd.read_excel(ds.filepath)
    if y and agg in ("sum", "mean"):
        grouped = df.groupby(x)[y].agg(agg).reset_index()
        labels = grouped[x].astype(str).tolist()
        values = grouped.iloc[:, 1].tolist()
    else:
        grouped = df[x].astype(str).value_counts().reset_index()
        grouped.columns = [x, "count"]
        labels = grouped[x].tolist()
        values = grouped["count"].tolist()
    return {"labels": labels, "values": values}

# ✅ Admin-only: get all datasets
@router.get("/all")
def get_all_datasets(skip: int = 0, limit: int = 50, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Not allowed")
    datasets = db.query(Dataset).offset(skip).limit(limit).all()
    return [
        {
            "id": ds.id,
            "filename": ds.filename,
            "user_id": ds.user_id,
            "rows_count": ds.rows_count,
            "uploaded_at": ds.uploaded_at
        }
        for ds in datasets
    ]

# ✅ Delete dataset: owner or admin
@router.delete("/{dataset_id}")
def delete_dataset(dataset_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    if current_user.role != "Admin" and ds.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")
    db.delete(ds)
    db.commit()
    return {"message": f"Dataset {dataset_id} deleted successfully"}
