from src.config.extensions import db

class BaseRepository:
    @staticmethod
    def save(obj):
        db.session.add(obj)
        db.session.commit()
        return obj

    @staticmethod
    def commit():
        db.session.commit()

    @staticmethod
    def delete(obj):
        db.session.delete(obj)
        db.session.commit()
