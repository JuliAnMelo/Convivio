from dataclasses import dataclass
from typing import Optional
from decimal import Decimal


@dataclass
class Zone:
    zone_id: int
    name: str
    description: Optional[str] = None
    capacity: Optional[int] = None
    price: Decimal
    availability: bool = False
    reservation_limit_hours: Optional[int] = None
    is_active: bool = False