from src.models import Reservation, Announcement
from src.config.extensions import db
from src.repositories.base_repository import BaseRepository

class BookingRepository(BaseRepository):
    @staticmethod
    def get_reservations_by_area(area_name, conjunto_id=None):
        q = Reservation.query.filter_by(area_name=area_name)
        if conjunto_id:
            q = q.filter_by(conjunto_id=conjunto_id)
        return q.order_by(Reservation.created_at.desc()).all()

    @staticmethod
    def get_reservation_by_id(res_id):
        return db.session.get(Reservation, res_id)

    @staticmethod
    def get_all_reservations(conjunto_id=None):
        q = Reservation.query
        if conjunto_id:
            q = q.filter_by(conjunto_id=conjunto_id)
        return q.order_by(Reservation.created_at.desc()).all()

    @staticmethod
    def get_pending_reservations(conjunto_id=None):
        q = Reservation.query.filter_by(status='pending_approval')
        if conjunto_id:
            q = q.filter_by(conjunto_id=conjunto_id)
        return q.order_by(Reservation.created_at.desc()).all()

    @staticmethod
    def get_all_announcements(conjunto_id=None):
        q = Announcement.query
        if conjunto_id:
            q = q.filter_by(conjunto_id=conjunto_id)
        return q.order_by(Announcement.created_at.desc()).all()

    @staticmethod
    def save_announcement(ann):
        db.session.add(ann)
        db.session.commit()
        return ann

    @staticmethod
    def get_announcement_by_id(ann_id):
        return db.session.get(Announcement, ann_id)

    @staticmethod
    def delete_announcement(ann):
        db.session.delete(ann)
        db.session.commit()
