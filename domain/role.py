from dataclasses import dataclass
from typing import Optional


@dataclass
class Role:
    role_id: int
    name: str
    description: Optional[str] = None