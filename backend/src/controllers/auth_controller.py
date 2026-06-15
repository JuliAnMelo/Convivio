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


@bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json or {}
    identifier = data.get('identifier', '').strip()
    new_password = data.get('newPassword', '')
    if not identifier or not new_password:
        return jsonify({'error': 'Faltan datos'}), 400
    ok, error = AuthService.reset_password(identifier, new_password)
    if not ok:
        return jsonify({'error': error}), 400
    return jsonify({'message': 'Contraseña actualizada correctamente'})
