from datetime import datetime
from typing import Optional
from domain.audit import AuditLog
from domain.user import User


def create_audit_log(
    user: "User",  # This is a forward reference to avoid circular imports
    action: str,
    entity_name: str,
    entity_id: int,
    details: Optional[str] = None
    ):
    audit_log = AuditLog(
        audit_id=None,  # This would be set by the database
        action=action,
        entity_name=entity_name,
        entity_id=entity_id,
        performed_at=datetime.now(),  # Automatically set to current time
        details=details,
        user=user,
    )
    user.audit_logs.append(audit_log)

    return audit_log