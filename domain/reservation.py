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
    start_date: datetime
    end_date: datetime
    total_price: Decimal = Decimal('0.00')
    approved_at: Optional[datetime] = None
    state: str = "pending"  # pending, approved, rejected, cancelled
    notes: Optional[str] = None
    requester: Optional["Inhabitant"] = None
    zone: Optional["Zone"] = None
    approved_by: Optional["Manager"] = None