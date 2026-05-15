from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User

@dataclass
class AuditLog:
    audit_id: int
    action: str
    entity_name: str
    entity_id: int
    performed_at: datetime = field(default_factory=datetime.now)
    details: Optional[str] = None

    user: Optional["User"] = None