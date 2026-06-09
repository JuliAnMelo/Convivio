from flask import Blueprint, request, jsonify
from src.services.auth_service import AuthService

bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')
    if not username or not password:
        return jsonify({'error': 'Faltan credenciales'}), 400
    user_data, error = AuthService.login(username, password)
    if error:
        return jsonify({'error': error}), 401
    return jsonify(user_data)
