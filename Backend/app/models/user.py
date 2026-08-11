from sqlalchemy import Column, Integer, String, Boolean, Enum, DateTime
from sqlalchemy.sql import func
import enum
from app.db.base import Base, production_table_args

class UserRole(str, enum.Enum):
    EDITOR = "Editor"
    VIEWER = "Viewer"

def _role_values(enum_cls: type[enum.Enum]) -> list[str]:
    return [member.value for member in enum_cls]

class User(Base):
    __tablename__ = "users"
    __table_args__ = production_table_args()

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String, unique=True, index=True, nullable=False)
    employee_name = Column(String, nullable=False)
    department = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String)
    password = Column(String, nullable=False)

    # Enforces that 'role' must be one of the Enums defined above
    role = Column(Enum(UserRole, values_callable=_role_values), default=UserRole.VIEWER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
