from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.base import Base, production_table_args

class User(Base):
    __tablename__ = "users"
    __table_args__ = production_table_args()

    employee_id = Column(String, primary_key=True, index=True)
    employee_name = Column(String, nullable=False)
    department = Column(String)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String)
    password = Column(String, nullable=False)
    role = Column(String(20), nullable=False, default="Viewer")
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
