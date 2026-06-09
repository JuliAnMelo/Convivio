from flask import Flask
from flask_cors import CORS
from src.config.extensions import db, migrate
from src.config.config import Config
from src.controllers import api_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)

    db.init_app(app)
    migrate.init_app(app, db)

    app.register_blueprint(api_bp)

    return app


