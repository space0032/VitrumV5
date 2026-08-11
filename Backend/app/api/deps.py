from fastapi import Header, HTTPException, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.services.security import verify_session_token

def require_manager_role(x_user_role: str = Header(default="OPERATOR")):
    """
    Role-Based Access Control (RBAC) Dependency.
    Only allows EDITOR (or the legacy ADMIN / MANAGER) to write data.
    If the frontend sends a VIEWER role, they are blocked!
    
    (Note: In a production AWS environment, this will decode a JWT token instead of reading a raw header).
    """
    if x_user_role.lower() not in ["admin", "manager", "editor"]:
        raise HTTPException(
            status_code=403, 
            detail="Forbidden: You do not have permission to edit this data. Editors and Admins only."
        )
    return x_user_role

_bearer = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
    db: Session = Depends(get_db),
) -> User:
    """
    Resolve the authenticated user from the `Authorization: Bearer <token>` header.
    Used by endpoints that require an active login session.
    """
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentication required.")

    employee_id = verify_session_token(credentials.credentials)
    if employee_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired session token.")

    user = db.query(User).filter(User.employee_id == employee_id).first()
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive.")

    return user
