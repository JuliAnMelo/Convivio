from datetime import datetime
from enum import Enum, auto
from domain.user import User, Inhabitant, Manager
from domain.communication import PQRS, Answer
from domain.audit import AuditLog


class ComunicationState(Enum):
    open = auto()
    closed = auto()
    archived = auto()

class PQRStype(Enum):
    peticion = auto()
    queja = auto()
    reclamo = auto()
    sugerencia = auto()

class PQRSpriority(Enum):
    low = auto()
    medium = auto()
    high = auto()


def create_pqrs(
    inhabitant: "Inhabitant",  # This is a forward reference to avoid circular imports
    title: str,
    description: str,
    pqrs_type: PQRStype, 
):
    pqrs = PQRS(
        communication_id=None,  # This would be set by the database
        title=title,
        description=description,
        created_at=datetime.now(),  # Automatically set to current time
        state=ComunicationState.open.name,  # Default state
        pqrs_type=pqrs_type.name,
        priority=PQRSpriority.medium.name,  # Default priority
        author=inhabitant
    )
    inhabitant.audit_logs.append(create_audit_log(inhabitant, "created_pqrs", "PQRS", 1, f"Created PQRS: {pqrs.title}"))

    return pqrs


def answer_pqrs(
    manager: "Manager",  # This is a forward reference to avoid circular imports
    pqrs: "PQRS",   # This is a forward reference to avoid circular imports
    title: str,
    description: str,
):
    answer = Answer(
        communication_id=None,  # This would be set by the database
        title=title,
        description=description,
        created_at=datetime.now(),  # Automatically set to current time
        state=ComunicationState.open.name,  # Default state
        is_internal=True,  # Default to internal answer
        pqrs=pqrs,
        author=manager,
    )
    pqrs.answers.append(answer)
    manager.audit_logs.append(create_audit_log(manager, "answered_pqrs", "PQRS", 1, f"Answered PQRS: {pqrs.title}"))
    pqrs.state = ComunicationState.closed.name

    return answer


def create_audit_log(
    user: "User",  # This is a forward reference to avoid circular imports
    action: str,
    entity_name: str,
    entity_id: int,
    details: str = ""
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