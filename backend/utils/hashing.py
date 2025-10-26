from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p: str):
    # truncate to 72 bytes
    truncated = p.encode("utf-8")[:72].decode("utf-8", errors="ignore")
    return pwd.hash(truncated)

def verify_password(plain, hashed):
    truncated = plain.encode("utf-8")[:72].decode("utf-8", errors="ignore")
    return pwd.verify(truncated, hashed)
