from src.models import Ticket
from src.config.extensions import db
from src.repositories.base_repository import BaseRepository

class PQRRepository(BaseRepository):
    @staticmethod
    def count_tickets():
        return Ticket.query.count()

    @staticmethod
    def get_all_tickets():
        return Ticket.query.order_by(Ticket.created_at.desc()).all()

    @staticmethod
    def get_ticket_by_id(ticket_id):
        return db.session.get(Ticket, ticket_id)
