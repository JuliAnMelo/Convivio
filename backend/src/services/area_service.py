from src.repositories.area_repository import AreaRepository
from src.repositories.base_repository import BaseRepository

class AreaService:
    @staticmethod
    def get_settings(area_name):
        return AreaRepository.get_or_create(area_name)

    @staticmethod
    def update_settings(area_name, data):
        setting = AreaRepository.get_or_create(area_name)
        if 'disabled' in data:
            setting.disabled = bool(data['disabled'])
        if 'disabledUntil' in data:
            from datetime import datetime
            val = data['disabledUntil']
            setting.disabled_until = datetime.fromisoformat(val) if val else None
        if 'disabledMessage' in data:
            setting.disabled_message = data['disabledMessage']
        if 'requiresApproval' in data:
            setting.requires_approval = bool(data['requiresApproval'])
        if 'photoUri' in data:
            setting.photo_uri = data['photoUri']
        BaseRepository.commit()
        return setting
