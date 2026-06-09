from src.models import User
from src.config.extensions import db
from src.repositories.base_repository import BaseRepository

class AuthRepository(BaseRepository):
    @staticmethod
    def get_by_username(username):
        return User.query.filter_by(username=username).first()

    @staticmethod
    def get_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def get_by_id(user_id):
        return db.session.get(User, user_id)
