from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from decimal import Decimal
from .user import Inhabitant, Manager
from .zone import Zone

@dataclass
class Reservation:
    reservation_id: int
    registered_at: datetime
    start_time: datetime
    end_time: datetime
    approved_at: Optional[datetime] = None
    total_price: Decimal = Decimal('0.00')
    state: str = "pending"  # pending, approved, rejected, cancelled
    notes: Optional[str] = None

    requester: Optional["Inhabitant"] = None
    zone: Optional[Zone] = None
    approved_by: Optional["Manager"] = None