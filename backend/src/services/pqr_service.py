from src.models import Ticket
from src.repositories.pqr_repository import PQRRepository
from datetime import datetime
import uuid

class PQRService:
    @staticmethod
    def create_ticket(data):
        ticket_count = PQRRepository.count_tickets()
        code = f"PQR-{str(ticket_count + 1).zfill(3)}"
        
        ticket = Ticket(
            id=f"pqr-{uuid.uuid4().hex[:8]}",
            conjunto_id=data.get('conjuntoId'),
            code=code,
            type=data.get('type'),
            subject=data.get('subject'),
            description=data.get('description'),
            status='esperando'
        )
        return PQRRepository.save(ticket)

    @staticmethod
    def get_all(conjunto_id=None):
        return PQRRepository.get_all_tickets(conjunto_id)

    @staticmethod
    def get_by_id(ticket_id):
        return PQRRepository.get_ticket_by_id(ticket_id)

    @staticmethod
    def respond(ticket_id, response):
        ticket = PQRRepository.get_ticket_by_id(ticket_id)
        if ticket:
            ticket.admin_response = response
            ticket.status = 'respondido'
            ticket.responded_at = datetime.utcnow()
            PQRRepository.commit()
        return ticket
