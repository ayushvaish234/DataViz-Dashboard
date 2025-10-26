from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import get_db
from models import User
from utils.hashing import hash_password, verify_password
from utils.jwt import create_access_token


router = APIRouter(prefix="/auth", tags=["auth"])

class SignupRequest(BaseModel):
    email: EmailStr
    password: str



class LoginRequest(BaseModel):
    email: EmailStr
    password: str



@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role}

@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    new_user = User(
        email=req.email,
        password_hash=hash_password(req.password),
        role="Member"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Signup successful"}