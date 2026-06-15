from flask import Blueprint, request, jsonify
from src.services.pqr_service import PQRService

bp = Blueprint('pqr', __name__, url_prefix='/pqr')


def _serialize(t):
    return {
        'id': t.id,
        'conjuntoId': t.conjunto_id,
        'code': t.code,
        'type': t.type,
        'subject': t.subject,
        'description': t.description or '',
        'status': t.status,
        'createdAt': t.created_at.isoformat() if t.created_at else None,
        'adminResponse': t.admin_response or None,
        'respondedAt': t.responded_at.isoformat() if t.responded_at else None,
    }


@bp.route('/', methods=['GET'])
def get_all():
    conjunto_id = request.args.get('conjuntoId')
    tickets = PQRService.get_all(conjunto_id)
    return jsonify([_serialize(t) for t in tickets])


@bp.route('/<ticket_id>', methods=['GET'])
def get_one(ticket_id):
    ticket = PQRService.get_by_id(ticket_id)
    if not ticket:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(_serialize(ticket))


@bp.route('/', methods=['POST'])
def create():
    ticket = PQRService.create_ticket(request.json)
    return jsonify(_serialize(ticket)), 201


@bp.route('/<ticket_id>/respond', methods=['POST'])
def respond(ticket_id):
    ticket = PQRService.respond(ticket_id, request.json.get('response'))
    if not ticket:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(_serialize(ticket))
