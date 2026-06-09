from flask import Blueprint, request, jsonify
from src.services.reservation_service import ReservationService

bp = Blueprint('reservations', __name__, url_prefix='/api/reservations')

@bp.route('/', methods=['POST'])
def create():
    data = request.json
    try:
        reservation = ReservationService.create_reservation(
            requester_id=data.get('requester_id'),
            zone_id=data.get('zone_id'),
            start_date_str=data.get('start_date'),
            end_date_str=data.get('end_date')
        )
        return jsonify({"message": "Reservation created", "id": reservation.reservation_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
