from src.models import Reservation, Zone, User
from src.repositories.reservation_repository import ReservationRepository
from datetime import datetime

class ReservationService:
    @staticmethod
    def create_reservation(requester_id, zone_id, start_date_str, end_date_str):
        zone = Zone.query.get(zone_id)
        if not zone:
            raise ValueError("Zone not found")
            
        start_date = datetime.fromisoformat(start_date_str)
        end_date = datetime.fromisoformat(end_date_str)
        
        reservation = Reservation(
            start_date=start_date,
            end_date=end_date,
            total_price=zone.price,
            requester_id=requester_id,
            zone_id=zone_id,
            state="PENDING"
        )
        return ReservationRepository.save(reservation)
