from flask import Blueprint
from .auth_controller import bp as auth_bp
from .conjunto_controller import bp as conjunto_bp
from .booking_controller import bp as booking_bp
from .pqr_controller import bp as pqr_bp
from .area_controller import bp as area_bp
from .chat_controller import bp as chat_bp

api_bp = Blueprint('api', __name__, url_prefix='/api')
api_bp.register_blueprint(auth_bp)
api_bp.register_blueprint(conjunto_bp)
api_bp.register_blueprint(booking_bp)
api_bp.register_blueprint(pqr_bp)
api_bp.register_blueprint(area_bp)
api_bp.register_blueprint(chat_bp)
