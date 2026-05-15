from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, TYPE_CHECKING
from .property import PropertyUnit

if TYPE_CHECKING:
    from .audit import AuditLog


@dataclass(kw_only=True)
class User:
    user_id: int
    full_name: str
    email: str
    phone: str
    password_hash: str
    created_at: datetime = field(default_factory=datetime.now)
    last_login: Optional[datetime] = None
    audit_logs: list["AuditLog"] = field(default_factory=list)
    is_active: bool = False

@dataclass
class Inhabitant(User):
    document_number: str
    birth_date: datetime
    move_in_date: datetime
    propertyunit: "PropertyUnit"
    is_owner: bool = False
    

@dataclass
class SecurityGuard(User):
    employee_code: str

@dataclass(kw_only=True)
class Manager(User):
    employee_code: str
    office_phone: Optional[str] = None
    subordinates: list["Subordinate"] = field(default_factory=list)

@dataclass
class Subordinate(Manager):
    position_title: str
    delegation_scope: Optional[str] = None
    supervisor_id: Optional[Manager] = None


@dataclass
class SuperUser(User):
    pass