from src.models import Ticket
from src.config.extensions import db
from src.repositories.base_repository import BaseRepository

class PQRRepository(BaseRepository):
    @staticmethod
    def count_tickets():
        return Ticket.query.count()

    @staticmethod
    def get_all_tickets(conjunto_id=None):
        q = Ticket.query
        if conjunto_id:
            q = q.filter_by(conjunto_id=conjunto_id)
        return q.order_by(Ticket.created_at.desc()).all()

    @staticmethod
    def get_ticket_by_id(ticket_id):
        return db.session.get(Ticket, ticket_id)
