from enum import Enum, auto
from datetime import datetime
from typing import Optional

from domain.reservation import Reservation
from domain.user import Inhabitant, Manager
from domain.zone import Zone


class ReservationState(Enum):
    PENDING = auto()
    APPROVED = auto()
    REJECTED = auto()
    CANCELLED = auto()


def create_reservation(
    inhabitant: "Inhabitant",  # This is a forward reference to avoid circular imports
    zone: "Zone",              # This is a forward reference to avoid circular imports
    start_date: datetime,
    end_date: datetime,
    notes: Optional[str] = None,
):
    reservation = Reservation(
        reservation_id=None,  # This would be set by the database
        registered_at=datetime.now(),  # Automatically set to current time
        start_date=start_date,
        end_date=end_date,
        total_price=zone.price,  # Calculate total price based on zone's price and duration
        approved_at=None,
        state=ReservationState.PENDING.name,  # Default state
        notes=notes,
        requester=inhabitant,
        zone=zone,
        approved_by=None
    )

    return reservation

def approve_reservation(
        approved_by: "Manager",  # This is a forward reference to avoid circular imports
        reservation: "Reservation",  # This is a forward reference to avoid circular imports
):
    reservation.state = ReservationState.APPROVED.name
    reservation.approved_at = datetime.now()
    reservation.approved_by = approved_by

    return reservation