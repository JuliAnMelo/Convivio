from flask import Blueprint, request, jsonify
from src.services.conjunto_service import ConjuntoService

bp = Blueprint('conjunto', __name__, url_prefix='/conjuntos')


def _serialize_conjunto(c):
    return {
        'id': c.id,
        'name': c.name,
        'code': c.code,
        'address': c.address or '',
        'city': c.city or '',
        'phone': c.phone or '',
        'email': c.email or '',
        'hours': c.hours or '',
        'imageKey': c.image_key or 'home',
        'photoUri': c.photo_url or None,
    }


def _serialize_request(r):
    return {
        'requestId': r.id,
        'userData': {
            'name': r.user_name,
            'email': r.user_email,
            'phone': r.user_phone or '',
            'dob': r.user_dob or '',
            'apt': r.user_apt or '',
            'torre': r.user_torre or '',
        },
        'role': r.role,
        'conjuntoId': r.conjunto_id,
        'status': r.status,
        'createdAt': r.created_at.isoformat() if r.created_at else None,
    }


@bp.route('/', methods=['GET'])
def get_all():
    conjuntos = ConjuntoService.get_all()
    return jsonify([_serialize_conjunto(c) for c in conjuntos])


@bp.route('/', methods=['POST'])
def create():
    data = request.json or {}
    conjunto = ConjuntoService.create_conjunto(data)
    return jsonify(_serialize_conjunto(conjunto)), 201


@bp.route('/by-id/<conjunto_id>', methods=['GET'])
def get_by_id(conjunto_id):
    c = ConjuntoService.get_by_id(conjunto_id)
    if not c:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(_serialize_conjunto(c))


@bp.route('/<code>', methods=['GET'])
def get_by_code(code):
    c = ConjuntoService.get_by_code(code)
    if not c:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(_serialize_conjunto(c))


@bp.route('/<conjunto_id>', methods=['PUT'])
def update(conjunto_id):
    data = request.json or {}
    c = ConjuntoService.update_conjunto(conjunto_id, data)
    if not c:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(_serialize_conjunto(c))


@bp.route('/requests', methods=['POST'])
def request_join():
    req = ConjuntoService.request_join(request.json)
    return jsonify(_serialize_request(req)), 201


@bp.route('/requests/<req_id>', methods=['GET'])
def get_request(req_id):
    req = ConjuntoService.get_request_by_id(req_id)
    if not req:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(_serialize_request(req))


@bp.route('/requests/<req_id>', methods=['PUT'])
def handle_request(req_id):
    req = ConjuntoService.handle_request(req_id, request.json or {})
    if not req:
        return jsonify({'error': 'Not found'}), 404
    return jsonify(_serialize_request(req))


@bp.route('/requests/<req_id>', methods=['DELETE'])
def delete_request(req_id):
    ok = ConjuntoService.delete_request(req_id)
    if not ok:
        return jsonify({'error': 'Not found'}), 404
    return jsonify({'message': 'Miembro eliminado del conjunto'})


@bp.route('/<conjunto_id>/requests', methods=['GET'])
def get_requests_for_conjunto(conjunto_id):
    status_filter = request.args.get('status')
    requests_list = ConjuntoService.get_requests_for_conjunto(conjunto_id, status_filter)
    return jsonify([_serialize_request(r) for r in requests_list])
