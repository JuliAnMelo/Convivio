"""
Limpia los datos de prueba que aparecían "por defecto" en los conjuntos
(anuncios, reservas y PQR). Estos modelos no están asociados a un conjunto,
así que son compartidos por todos; ejecutar esto los deja vacíos.

Uso:
    python clear_demo_data.py
"""
from src.app import create_app
from src.config.extensions import db
from src.models import Announcement, Reservation, Ticket

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        anns = Announcement.query.delete()
        res = Reservation.query.delete()
        tickets = Ticket.query.delete()
        db.session.commit()
        print(f"Eliminados: {anns} anuncios, {res} reservas, {tickets} PQR.")
        print("Listo: los conjuntos quedan sin anuncios por defecto.")
