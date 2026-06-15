from src.models import ChatMessage
from src.config.extensions import db
from src.repositories.base_repository import BaseRepository
from datetime import datetime


class ChatRepository(BaseRepository):
    @staticmethod
    def get_messages(conjunto_id, since=None):
        q = ChatMessage.query.filter_by(conjunto_id=conjunto_id)
        if since:
            q = q.filter(ChatMessage.created_at > since)
        return q.order_by(ChatMessage.created_at.asc()).all()

    @staticmethod
    def save_message(message):
        db.session.add(message)
        db.session.commit()
        return message
