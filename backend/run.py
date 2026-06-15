from src.app import create_app
from src.config.extensions import db
from src.models import Conjunto

app = create_app()

def seed_conjuntos():
    demo = [
        {
            'id': 'C001', 'name': 'Conjunto Residencial El Prado', 'code': 'CONV01',
            'address': 'Calle 45 # 23-67', 'city': 'Bogotá, Colombia',
            'phone': '(601) 234-5678', 'email': 'admin@elprado.com.co',
            'hours': 'Lun - Vie: 8:00 am - 5:00 pm', 'image_key': 'home',
        },
        {
            'id': 'C002', 'name': 'Torres del Parque', 'code': 'TPARK1',
            'address': 'Carrera 7 # 32-16', 'city': 'Bogotá, Colombia',
            'phone': '(601) 345-6789', 'email': 'admin@torresdelparque.com.co',
            'hours': 'Lun - Sáb: 7:00 am - 6:00 pm', 'image_key': 'salon',
        },
    ]
    for d in demo:
        if not db.session.get(Conjunto, d['id']):
            db.session.add(Conjunto(**d))
    db.session.commit()

def migrate_schema():
    from sqlalchemy import text
    statements = [
        "ALTER TABLE conjuntos ADD COLUMN IF NOT EXISTS photo_url TEXT",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS torre VARCHAR(50)",
        "ALTER TABLE join_requests ADD COLUMN IF NOT EXISTS user_apt VARCHAR(50)",
        "ALTER TABLE join_requests ADD COLUMN IF NOT EXISTS user_torre VARCHAR(50)",
        "ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS sender_apt VARCHAR(100)",
        "ALTER TABLE announcements ADD COLUMN IF NOT EXISTS conjunto_id VARCHAR(50)",
        "ALTER TABLE reservations ADD COLUMN IF NOT EXISTS conjunto_id VARCHAR(50)",
        "ALTER TABLE tickets ADD COLUMN IF NOT EXISTS conjunto_id VARCHAR(50)",
        "ALTER TABLE reservations ADD COLUMN IF NOT EXISTS user_photo_uri TEXT",
    ]
    with db.engine.connect() as conn:
        for stmt in statements:
            conn.execute(text(stmt))
        conn.commit()

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        migrate_schema()
        seed_conjuntos()
        from src.services.auth_service import AuthService
        AuthService.create_demo_users()
        print("Base de datos lista.")
    app.run(debug=True, host='0.0.0.0', port=5000)
