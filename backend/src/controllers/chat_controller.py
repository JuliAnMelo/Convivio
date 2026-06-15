from flask import Blueprint, request, jsonify
from src.services.chat_service import ChatService

bp = Blueprint('chat', __name__, url_prefix='/chat')


def _serialize(msg):
    return {
        'id': msg.id,
        'conjuntoId': msg.conjunto_id,
        'senderRole': msg.sender_role,
        'senderName': msg.sender_name,
        'senderApt': msg.sender_apt or '',
        'text': msg.text,
        'createdAt': msg.created_at.isoformat() if msg.created_at else None,
    }


@bp.route('/messages', methods=['GET'])
def get_messages():
    conjunto_id = request.args.get('conjuntoId')
    since = request.args.get('since')
    if not conjunto_id:
        return jsonify({'error': 'conjuntoId requerido'}), 400
    messages = ChatService.get_messages(conjunto_id, since)
    return jsonify([_serialize(m) for m in messages])


@bp.route('/messages', methods=['POST'])
def send_message():
    data = request.json or {}
    conjunto_id = data.get('conjuntoId')
    sender_role = data.get('senderRole')
    sender_name = data.get('senderName')
    sender_apt = data.get('senderApt', '')
    text = data.get('text', '').strip()

    if not conjunto_id or not sender_role or not sender_name or not text:
        return jsonify({'error': 'Campos incompletos'}), 400

    msg = ChatService.send_message(conjunto_id, sender_role, sender_name, text, sender_apt)
    return jsonify(_serialize(msg)), 201
