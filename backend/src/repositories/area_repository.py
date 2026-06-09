from src.models import AreaSetting
from src.config.extensions import db
from src.repositories.base_repository import BaseRepository

class AreaRepository(BaseRepository):
    @staticmethod
    def get_by_name(area_name):
        return db.session.get(AreaSetting, area_name)

    @staticmethod
    def get_or_create(area_name):
        setting = db.session.get(AreaSetting, area_name)
        if not setting:
            setting = AreaSetting(area_name=area_name)
            db.session.add(setting)
            db.session.commit()
        return setting
