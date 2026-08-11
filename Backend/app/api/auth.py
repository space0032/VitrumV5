from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.auth import LoginRequest, UserCreate, UserResponse, ChangePasswordRequest
from app.services.security import (
    create_session_token,
    hash_password,
    verify_password,
)
from app.api.deps import get_current_user

router = APIRouter(tags=["Authentication"])

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate an existing user by email address OR mobile number.
    Returns a signed session token plus the user profile.
    """
    identifier = payload.identifier.strip()
    email = identifier.lower()

    user = (
        db.query(User)
        .filter((func.lower(User.email) == email) | (User.phone_number == identifier))
        .first()
    )

    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid User ID or password.")

    if not verify_password(payload.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid User ID or password.")

    return {
        "token": create_session_token(user.id),
        "user": UserResponse.model_validate(user),
    }

@router.post("/register", response_model=UserResponse, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account in production.users.
    Rejects duplicate emails / employee IDs and stores the password hashed.
    """
    email = payload.email.strip().lower()
    employee_id = payload.employee_id.strip()

    if db.query(User).filter(func.lower(User.email) == email).first():
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    if db.query(User).filter(User.employee_id == employee_id).first():
        raise HTTPException(status_code=409, detail="An account with this Employee ID already exists.")

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    role = payload.role or UserRole.VIEWER.value
    if role not in (UserRole.EDITOR.value, UserRole.VIEWER.value):
        raise HTTPException(status_code=400, detail="Role must be either Editor or Viewer.")

    user = User(
        employee_id=employee_id,
        employee_name=payload.employee_name.strip(),
        department=payload.department.strip(),
        email=email,
        phone_number=payload.phone_number.strip(),
        password=hash_password(payload.password),
        role=UserRole(role),
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Change the authenticated user's password.
    Verifies the current password before storing the new (hashed) one.
    """
    if not verify_password(payload.current_password, user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="New password and confirmation do not match.")

    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    user.password = hash_password(payload.new_password)
    db.commit()
    return {"detail": "Password updated successfully."}

@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)):
    """
    Return the currently authenticated user (used to restore a session on refresh).
    """
    return user
