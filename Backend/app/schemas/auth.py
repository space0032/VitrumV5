from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LoginRequest(BaseModel):
    # Email address OR mobile number
    identifier: str
    password: str

class UserCreate(BaseModel):
    employee_id: str
    employee_name: str
    department: str
    email: str
    phone_number: str
    password: str
    role: Optional[str] = "Viewer"

class UserResponse(BaseModel):
    id: int
    employee_id: str
    employee_name: str
    department: str
    email: str
    phone_number: Optional[str] = None
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str
