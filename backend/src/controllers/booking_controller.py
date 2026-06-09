from flask import Blueprint, request, jsonify
from src.services.booking_service import BookingService

bp = Blueprint('booking', __name__, url_prefix='/bookings')

MONTH_NAMES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']


def _serialize_reservation(r):
    return {
        'id': r.id,
        'areaName': r.area_name,
        'year': r.year,
        'monthIndex': r.month_index,
        'monthName': MONTH_NAMES_ES[r.month_index] if r.month_index is not None else '',
        'day': r.day,
        'timeSlot': r.time_slot,
        'eventTitle': r.event_title,
        'people': r.people,
        'description': r.description or '',
        'userName': r.user_name or '',
        'status': r.status,
        'cancelledMessage': r.cancelled_message or '',
        'createdAt': r.created_at.isoformat() if r.created_at else None,
    }


def _serialize_announcement(a):
    d = a.created_at
    return {
        'id': a.id,
        'title': a.title,
        'subtitle': a.subtitle or '',
        'tag': a.tag or '',
        'icon': a.icon or 'megaphone',
        'type': a.type or 'general',
        'category': a.category or None,
        'month': MONTH_NAMES_ES[d.month - 1] if d else '',
        'day': d.day if d else 0,
        'time': f"{d.hour:02d}:{d.minute:02d}" if d else '00:00',
        'createdAt': d.isoformat() if d else None,
    }


@bp.route('/', methods=['POST'])
def create():
    res = BookingService.create_reservation(request.json)
    return jsonify(_serialize_reservation(res)), 201


@bp.route('/', methods=['GET'])
def get_all():
    reservations = BookingService.get_all_reservations()
    return jsonify([_serialize_reservation(r) for r in reservations])


@bp.route('/pending', methods=['GET'])
def get_pending():
    reservations = BookingService.get_pending_reservations()
    return jsonify([_serialize_reservation(r) for r in reservations])


@bp.route('/announcements', methods=['GET'])
def get_announcements():
    announcements = BookingService.get_announcements()
    return jsonify([_serialize_announcement(a) for a in announcements])


@bp.route('/announcements', methods=['POST'])
def create_announcement():
    ann = BookingService.create_announcement(request.json)
    return jsonify(_serialize_announcement(ann)), 201


@bp.route('/<area_name>', methods=['GET'])
def get_reservations(area_name):
    reservations = BookingService.get_reservations(area_name)
    return jsonify([_serialize_reservation(r) for r in reservations])


@bp.route('/<res_id>/approve', methods=['POST'])
def approve(res_id):
    res = BookingService.approve(res_id)
    if not res:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(_serialize_reservation(res))


@bp.route('/<res_id>/cancel', methods=['POST'])
def cancel(res_id):
    res = BookingService.cancel(res_id, request.json.get('message', ''))
    if not res:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(_serialize_reservation(res))
