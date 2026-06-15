from src.models import Conjunto, JoinRequest
from src.repositories.conjunto_repository import ConjuntoRepository
import uuid
import random
import string

def _gen_code():
    chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    return ''.join(random.choices(chars, k=6))

class ConjuntoService:
    @staticmethod
    def get_all():
        return ConjuntoRepository.get_all()

    @staticmethod
    def get_by_code(code):
        return ConjuntoRepository.get_by_code(code.upper())

    @staticmethod
    def get_by_id(conjunto_id):
        return ConjuntoRepository.get_by_id(conjunto_id)

    @staticmethod
    def create_conjunto(data):
        conjunto = Conjunto(
            id=f"C{int(uuid.uuid4().int % 1000000):06d}",
            name=data.get('name', '').strip(),
            code=_gen_code(),
            address=data.get('address', '').strip(),
            city=data.get('city', 'Colombia'),
            phone=data.get('phone', ''),
            email=data.get('email', ''),
            hours=data.get('hours', ''),
            image_key=data.get('imageKey', 'home'),
            photo_url=data.get('photoUri') or None,
        )
        return ConjuntoRepository.save(conjunto)

    @staticmethod
    def update_conjunto(conjunto_id, data):
        c = ConjuntoRepository.get_by_id(conjunto_id)
        if not c:
            return None
        for field, col in [
            ('name', 'name'), ('address', 'address'), ('city', 'city'),
            ('phone', 'phone'), ('email', 'email'), ('hours', 'hours'),
            ('imageKey', 'image_key'), ('photoUri', 'photo_url'),
        ]:
            if field in data:
                setattr(c, col, data[field])
        ConjuntoRepository.commit()
        return c

    @staticmethod
    def request_join(data):
        req = JoinRequest(
            id=f"req-{uuid.uuid4().hex[:8]}",
            user_name=data.get('name'),
            user_email=data.get('email'),
            user_phone=data.get('phone'),
            user_dob=data.get('dob'),
            user_apt=data.get('apt'),
            user_torre=data.get('torre'),
            role=data.get('role'),
            conjunto_id=data.get('conjuntoId'),
            status='pending'
        )
        return ConjuntoRepository.save(req)

    @staticmethod
    def get_request_by_id(req_id):
        return ConjuntoRepository.get_request_by_id(req_id)

    @staticmethod
    def handle_request(req_id, data):
        req = ConjuntoRepository.get_request_by_id(req_id)
        if req:
            if data.get('status') is not None:
                req.status = data['status']
            if data.get('apt') is not None:
                req.user_apt = data['apt']
            ConjuntoRepository.commit()
        return req

    @staticmethod
    def get_requests_for_conjunto(conjunto_id, status_filter=None):
        return ConjuntoRepository.get_requests_for_conjunto(conjunto_id, status_filter)

    @staticmethod
    def delete_request(req_id):
        req = ConjuntoRepository.get_request_by_id(req_id)
        if not req:
            return False
        ConjuntoRepository.delete(req)
        return True
