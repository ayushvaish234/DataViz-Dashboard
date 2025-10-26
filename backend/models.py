from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="Member")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    columns = Column(JSON, nullable=True)
    rows_count = Column(Integer, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
