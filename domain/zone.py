from dataclasses import dataclass
from typing import Optional
from decimal import Decimal


@dataclass
class Zone:
    zone_id: int
    name: str
    price: Decimal
    description: Optional[str] = None
    capacity: Optional[int] = None
    available: bool = False
    reservation_limit_hours: Optional[int] = None
    is_active: bool = False