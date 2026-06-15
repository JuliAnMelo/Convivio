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
            conjunto_id=data.get('conjuntoId'),
            area_name=data.get('areaName'),
            year=data.get('year'),
            month_index=data.get('monthIndex'),
            day=data.get('day'),
            time_slot=data.get('timeSlot'),
            event_title=data.get('eventTitle'),
            people=data.get('people', 0),
            description=data.get('description'),
            user_name=data.get('userName'),
            user_photo_uri=data.get('userPhotoUri'),
            status=status
        )
        BookingRepository.save(res)

        if not requires_approval:
            ann = Announcement(
                id=f"ann-{res.id}",
                conjunto_id=res.conjunto_id,
                title=res.event_title,
                subtitle=f"Solicitud De Reserva {res.area_name}",
                tag='',
                icon='key',
                type='reservation'
            )
            BookingRepository.save_announcement(ann)

        return res

    @staticmethod
    def get_reservations(area_name, conjunto_id=None):
        return BookingRepository.get_reservations_by_area(area_name, conjunto_id)

    @staticmethod
    def get_all_reservations(conjunto_id=None):
        return BookingRepository.get_all_reservations(conjunto_id)

    @staticmethod
    def get_pending_reservations(conjunto_id=None):
        return BookingRepository.get_pending_reservations(conjunto_id)

    @staticmethod
    def approve(res_id):
        res = BookingRepository.get_reservation_by_id(res_id)
        if res:
            res.status = 'confirmed'

            # Notificamos al residente que su reserva fue aprobada.
            ann = Announcement(
                id=f"notif-approve-{res.id}",
                conjunto_id=res.conjunto_id,
                title=f"Reserva aprobada: {res.event_title}",
                subtitle=f"Tu reserva de {res.area_name} fue aprobada por la administración.",
                tag='Administración',
                icon='key',
                type='reservation'
            )
            BookingRepository.save_announcement(ann)
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
                conjunto_id=res.conjunto_id,
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
    def get_announcements(conjunto_id=None):
        return BookingRepository.get_all_announcements(conjunto_id)

    @staticmethod
    def create_announcement(data):
        ann = Announcement(
            id=f"ann-admin-{uuid.uuid4().hex[:8]}",
            conjunto_id=data.get('conjuntoId'),
            title=data.get('title', '').strip(),
            subtitle=data.get('description', '').strip(),
            tag=data.get('tag', 'Para: Todos'),
            icon=data.get('icon', 'megaphone'),
            type='general',
            category=data.get('category'),
        )
        BookingRepository.save_announcement(ann)
        return ann

    @staticmethod
    def delete_announcement(ann_id):
        ann = BookingRepository.get_announcement_by_id(ann_id)
        if not ann:
            return False
        BookingRepository.delete_announcement(ann)
        return True
