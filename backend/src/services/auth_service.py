from werkzeug.security import generate_password_hash, check_password_hash
from src.models import User, Conjunto
from src.config.extensions import db
from src.repositories.auth_repository import AuthRepository
from src.repositories.base_repository import BaseRepository

MONTH_NAMES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

class AuthService:
    @staticmethod
    def login(username, password):
        user = AuthRepository.get_by_username(username)
        if not user:
            return None, 'Usuario no encontrado'
        if not check_password_hash(user.password_hash, password):
            return None, 'Contraseña incorrecta'
        return AuthService._serialize(user), None

    @staticmethod
    def _serialize(user):
        conjunto = db.session.get(Conjunto, user.conjunto_id) if user.conjunto_id else None
        return {
            'id': user.id,
            'username': user.username,
            'name': user.name,
            'email': user.email,
            'phone': user.phone or '',
            'dob': user.dob or '',
            'apt': user.apt or 'Por asignar',
            'role': user.role,
            'conjuntoId': user.conjunto_id,
            'conjuntoIds': [user.conjunto_id] if user.conjunto_id else [],
            'conjuntoCode': conjunto.code if conjunto else None,
            'conjuntoName': conjunto.name if conjunto else None,
        }

    @staticmethod
    def create_demo_users():
        demo_users = [
            {
                'username': 'prueba', 'password': '1234',
                'name': 'Jhon Garcia', 'email': 'prueba@demo.com',
                'phone': '+123 456 7890', 'dob': '01/01/1990',
                'apt': '303', 'role': 'residente', 'conjunto_id': 'C001',
            },
            {
                'username': 'admin', 'password': '1234',
                'name': 'Carlos Gómez', 'email': 'admin@demo.com',
                'phone': '+123 456 0001', 'dob': '15/03/1980',
                'apt': 'Administración', 'role': 'administrador', 'conjunto_id': 'C001',
            },
            {
                'username': 'guarda', 'password': '1234',
                'name': 'Luis Pérez', 'email': 'guarda@demo.com',
                'phone': '+123 456 0002', 'dob': '20/07/1985',
                'apt': 'Portería', 'role': 'guarda', 'conjunto_id': 'C001',
            },
        ]
        for d in demo_users:
            if not AuthRepository.get_by_username(d['username']):
                user = User(
                    username=d['username'],
                    password_hash=generate_password_hash(d['password']),
                    name=d['name'],
                    email=d['email'],
                    phone=d['phone'],
                    dob=d['dob'],
                    apt=d['apt'],
                    role=d['role'],
                    conjunto_id=d['conjunto_id'],
                )
                BaseRepository.save(user)
