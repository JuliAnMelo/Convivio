from src.models import Reservation, Announcement
from src.config.extensions import db
from src.repositories.base_repository import BaseRepository

class BookingRepository(BaseRepository):
    @staticmethod
    def get_reservations_by_area(area_name):
        return Reservation.query.filter_by(area_name=area_name)\
            .order_by(Reservation.created_at.desc()).all()

    @staticmethod
    def get_reservation_by_id(res_id):
        return db.session.get(Reservation, res_id)

    @staticmethod
    def get_all_reservations():
        return Reservation.query.order_by(Reservation.created_at.desc()).all()

    @staticmethod
    def get_pending_reservations():
        return Reservation.query.filter_by(status='pending_approval')\
            .order_by(Reservation.created_at.desc()).all()

    @staticmethod
    def get_all_announcements():
        return Announcement.query.order_by(Announcement.created_at.desc()).all()

    @staticmethod
    def save_announcement(ann):
        db.session.add(ann)
        db.session.commit()
        return ann
