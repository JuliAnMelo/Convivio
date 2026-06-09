from src.models import Reservation, Announcement
from src.repositories.booking_repository import BookingRepository
import uuid

class BookingService:
    @staticmethod
    def create_reservation(data):
        requires_approval = data.get('requiresApproval', False)
        status = 'pending_approval' if requires_approval else 'confirmed'

        res = Reservation(
            id=f"res-{uuid.uuid4().hex[:8]}",
            area_name=data.get('areaName'),
            year=data.get('year'),
            month_index=data.get('monthIndex'),
            day=data.get('day'),
            time_slot=data.get('timeSlot'),
            event_title=data.get('eventTitle'),
            people=data.get('people', 0),
            description=data.get('description'),
            user_name=data.get('userName'),
            status=status
        )
        BookingRepository.save(res)

        if not requires_approval:
            ann = Announcement(
                id=f"ann-{res.id}",
                title=res.event_title,
                subtitle=f"Solicitud De Reserva {res.area_name}",
                tag='',
                icon='key',
                type='reservation'
            )
            BookingRepository.save_announcement(ann)

        return res

    @staticmethod
    def get_reservations(area_name):
        return BookingRepository.get_reservations_by_area(area_name)

    @staticmethod
    def get_all_reservations():
        return BookingRepository.get_all_reservations()

    @staticmethod
    def get_pending_reservations():
        return BookingRepository.get_pending_reservations()

    @staticmethod
    def approve(res_id):
        res = BookingRepository.get_reservation_by_id(res_id)
        if res:
            res.status = 'confirmed'
            BookingRepository.commit()
        return res

    @staticmethod
    def cancel(res_id, message=""):
        res = BookingRepository.get_reservation_by_id(res_id)
        if res:
            res.status = 'cancelled'
            res.cancelled_message = message

            ann = Announcement(
                id=f"notif-cancel-{res.id}",
                title=f"Reserva cancelada: {res.event_title}",
                subtitle=message or "El administrador canceló tu reserva.",
                tag='Administración',
                icon='cancel',
                type='cancellation'
            )
            BookingRepository.save_announcement(ann)
            BookingRepository.commit()
        return res

    @staticmethod
    def get_announcements():
        return BookingRepository.get_all_announcements()

    @staticmethod
    def create_announcement(data):
        ann = Announcement(
            id=f"ann-admin-{uuid.uuid4().hex[:8]}",
            title=data.get('title', '').strip(),
            subtitle=data.get('description', '').strip(),
            tag=data.get('tag', 'Para: Todos'),
            icon=data.get('icon', 'megaphone'),
            type='general',
            category=data.get('category'),
        )
        BookingRepository.save_announcement(ann)
        return ann
