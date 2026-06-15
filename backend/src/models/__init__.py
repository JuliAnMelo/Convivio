from src.config.extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(50))
    dob = db.Column(db.String(50))
    apt = db.Column(db.String(50))
    torre = db.Column(db.String(50))
    role = db.Column(db.String(50))
    conjunto_id = db.Column(db.String(50), db.ForeignKey('conjuntos.id'))

class Conjunto(db.Model):
    __tablename__ = 'conjuntos'
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    code = db.Column(db.String(50), unique=True, nullable=False)
    address = db.Column(db.String(250))
    city = db.Column(db.String(100))
    phone = db.Column(db.String(50))
    email = db.Column(db.String(150))
    hours = db.Column(db.String(150))
    image_key = db.Column(db.String(250))
    photo_url = db.Column(db.Text)

class JoinRequest(db.Model):
    __tablename__ = 'join_requests'
    id = db.Column(db.String(50), primary_key=True)
    user_name = db.Column(db.String(150))
    user_email = db.Column(db.String(150))
    user_phone = db.Column(db.String(50))
    user_dob = db.Column(db.String(50))
    user_apt = db.Column(db.String(50))
    user_torre = db.Column(db.String(50))
    role = db.Column(db.String(50))
    conjunto_id = db.Column(db.String(50), db.ForeignKey('conjuntos.id'))
    status = db.Column(db.String(50), default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AreaSetting(db.Model):
    __tablename__ = 'area_settings'
    area_name = db.Column(db.String(100), primary_key=True)
    disabled = db.Column(db.Boolean, default=False)
    disabled_until = db.Column(db.DateTime, nullable=True)
    disabled_message = db.Column(db.String(250))
    requires_approval = db.Column(db.Boolean, default=False)
    photo_uri = db.Column(db.String(500))

class Reservation(db.Model):
    __tablename__ = 'reservations'
    id = db.Column(db.String(50), primary_key=True)
    conjunto_id = db.Column(db.String(50), db.ForeignKey('conjuntos.id'))
    area_name = db.Column(db.String(100))
    year = db.Column(db.Integer)
    month_index = db.Column(db.Integer)
    day = db.Column(db.Integer)
    time_slot = db.Column(db.String(50))
    event_title = db.Column(db.String(150))
    people = db.Column(db.Integer)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_name = db.Column(db.String(150))
    user_photo_uri = db.Column(db.Text)
    status = db.Column(db.String(50), default="confirmed")
    cancelled_message = db.Column(db.String(250))

class Announcement(db.Model):
    __tablename__ = 'announcements'
    id = db.Column(db.String(50), primary_key=True)
    conjunto_id = db.Column(db.String(50), db.ForeignKey('conjuntos.id'))
    title = db.Column(db.String(250), nullable=False)
    subtitle = db.Column(db.Text)
    tag = db.Column(db.String(100))
    icon = db.Column(db.String(50))
    type = db.Column(db.String(50))
    category = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Ticket(db.Model):
    __tablename__ = 'tickets'
    id = db.Column(db.String(50), primary_key=True)
    conjunto_id = db.Column(db.String(50), db.ForeignKey('conjuntos.id'))
    code = db.Column(db.String(50), unique=True)
    type = db.Column(db.String(50))
    subject = db.Column(db.String(250))
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default="esperando")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    admin_response = db.Column(db.Text)
    responded_at = db.Column(db.DateTime, nullable=True)

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = db.Column(db.String(50), primary_key=True)
    conjunto_id = db.Column(db.String(50), db.ForeignKey('conjuntos.id'), nullable=False)
    sender_role = db.Column(db.String(50), nullable=False)
    sender_name = db.Column(db.String(150), nullable=False)
    sender_apt = db.Column(db.String(100))
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
