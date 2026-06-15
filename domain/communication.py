from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

from .user import User

@dataclass
class Attachment:
    attachment_id: int
    file_name: str
    file_path: str
    mime_type: str
    uploaded_at: datetime = field(default_factory=datetime.now)

@dataclass(kw_only=True)
class Communication:
    communication_id: int
    title: str
    description: str
    created_at: datetime = field(default_factory=datetime.now)
    state: str = "open"  # open, closed, archived
    author: Optional["User"] = None
    attachment: list["Attachment"] = field(default_factory=list)

@dataclass
class PQRS(Communication):
    pqrs_type: str  # peticion, queja, reclamo, sugerencia
    priority: str = "medium"  # low, medium, high
    answers: list["Answer"] = field(default_factory=list)

@dataclass
class Question(Communication):
    pass

@dataclass
class Answer(Communication):
    is_internal: bool = True
    pqrs: Optional[PQRS] = None
    question: Optional[Question] = None

@dataclass
class Announcement(Communication):
    published_at: datetime = field(default_factory=datetime.now)
    expire_at: Optional[datetime] = None
    is_urgent: bool = False