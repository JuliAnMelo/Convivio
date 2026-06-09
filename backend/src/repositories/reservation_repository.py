from src.models import Reservation
from src.config.extensions import db

class ReservationRepository:
    @staticmethod
    def save(reservation):
        db.session.add(reservation)
        db.session.commit()
        return reservation

    @staticmethod
    def get_by_id(reservation_id):
        return db.session.get(Reservation, reservation_id)
