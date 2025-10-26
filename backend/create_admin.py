# create_admin_console.py
from database import get_db
from models import User
from utils.hashing import hash_password

def create_admin():
    email = input("Enter admin email: ").strip()
    password = input("Enter admin password: ").strip()

    db = next(get_db())

    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"User with email {email} already exists.")
        return

    admin_user = User(
        email=email,
        password_hash=hash_password(password),
        role="Admin"
    )
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    print(f"Admin created successfully! Email: {email}")

if __name__ == "__main__":
    create_admin()
