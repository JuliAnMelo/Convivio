from src.models import ChatMessage
from src.repositories.chat_repository import ChatRepository
import uuid
from datetime import datetime


class ChatService:
    @staticmethod
    def get_messages(conjunto_id, since_iso=None):
        since = None
        if since_iso:
            try:
                since = datetime.fromisoformat(since_iso.replace('Z', '+00:00'))
            except Exception:
                since = None
        return ChatRepository.get_messages(conjunto_id, since)

    @staticmethod
    def send_message(conjunto_id, sender_role, sender_name, text, sender_apt=''):
        msg = ChatMessage(
            id=f"msg-{uuid.uuid4().hex[:12]}",
            conjunto_id=conjunto_id,
            sender_role=sender_role,
            sender_name=sender_name,
            sender_apt=sender_apt or '',
            text=text.strip(),
        )
        return ChatRepository.save_message(msg)
