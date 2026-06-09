from src.models import Conjunto, JoinRequest
from src.config.extensions import db
from src.repositories.base_repository import BaseRepository

class ConjuntoRepository(BaseRepository):
    @staticmethod
    def get_all():
        return Conjunto.query.all()

    @staticmethod
    def get_by_code(code):
        return Conjunto.query.filter_by(code=code).first()

    @staticmethod
    def get_by_id(conjunto_id):
        return db.session.get(Conjunto, conjunto_id)

    @staticmethod
    def get_request_by_id(req_id):
        return db.session.get(JoinRequest, req_id)

    @staticmethod
    def get_requests_for_conjunto(conjunto_id, status_filter=None):
        q = JoinRequest.query.filter_by(conjunto_id=conjunto_id)
        if status_filter:
            q = q.filter_by(status=status_filter)
        return q.order_by(JoinRequest.created_at.desc()).all()
