from datetime import datetime
from enum import Enum, auto

from domain.user import Inhabitant, Manager
from domain.communication import PQRS, Answer


class CommunicationState(Enum):
    OPEN = auto()
    CLOSED = auto()
    ARCHIVED = auto()

class PQRStype(Enum):
    PETICION = auto()
    QUEJA = auto()
    RECLAMO = auto()
    SUGERENCIA = auto()

class PQRSpriority(Enum):
    LOW = auto()
    MEDIUM = auto()
    HIGH = auto()


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
        state=CommunicationState.OPEN.name,  # Default state
        pqrs_type=pqrs_type.name,
        priority=PQRSpriority.MEDIUM.name,  # Default priority
        author=inhabitant
    )

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
        state=CommunicationState.OPEN.name,  # Default state
        is_internal=True,  # Default to internal answer
        pqrs=pqrs,
        author=manager,
    )
    pqrs.answers.append(answer)
    pqrs.state = CommunicationState.CLOSED.name

    return answer