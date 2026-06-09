from flask import Blueprint, request, jsonify
from src.services.area_service import AreaService

bp = Blueprint('area', __name__, url_prefix='/areas')


def _serialize(s):
    return {
        'areaName': s.area_name,
        'disabled': s.disabled,
        'disabledUntil': s.disabled_until.isoformat() if s.disabled_until else None,
        'disabledMessage': s.disabled_message or '',
        'requiresApproval': s.requires_approval,
        'photoUri': s.photo_uri or None,
    }


@bp.route('/<area_name>', methods=['GET'])
def get_settings(area_name):
    setting = AreaService.get_settings(area_name)
    return jsonify(_serialize(setting))


@bp.route('/<area_name>', methods=['PUT'])
def update_settings(area_name):
    setting = AreaService.update_settings(area_name, request.json or {})
    return jsonify(_serialize(setting))
