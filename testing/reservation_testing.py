from datetime import datetime, timedelta

from service.audit_service import create_audit_log
from service.reservation_service import create_reservation, approve_reservation
from repository.dummy_data import DUMMY_ZONES, DUMMY_MANAGER, DUMMY_INHABITANTS 


def example_workflow(inhabitant, manager, zone):
    # 1. Crear Reserva
    reservation = create_reservation(
        inhabitant=inhabitant,
        zone=zone,
        start_date=datetime.now() + timedelta(days=7),
        end_date=datetime.now() + timedelta(days=7, hours=4),
        notes="Cumpleaños familiar",
    )

    # 2. Auditoría de creación
    create_audit_log(
        user=inhabitant,
        action="CREATE_RESERVATION",
        entity_name="Reservation",
        entity_id=reservation.reservation_id,
        details="El residente creó una reservación",
    )

    # 3. Aprobar Reserva
    approved_reservation = approve_reservation(
        approved_by=manager,
        reservation=reservation,
    )

    # 4. Auditoría de aprobación
    create_audit_log(
        user=manager,
        action="APPROVE_RESERVATION",
        entity_name="Reservation",
        entity_id=approved_reservation.reservation_id,
        details="El administrador aprobó la reservación",
    )

    return reservation, approved_reservation


if __name__ == "__main__":
    # Seleccionar una zona existente para asociar a la reserva
    selected_zone = DUMMY_ZONES[0]

    # Crear un residente (Inhabitant)
    inhabitant = DUMMY_INHABITANTS[1]

    # Crear un administrador (Manager)
    manager = DUMMY_MANAGER

    # Ejecutar el flujo completo
    reservation, approved_reservation = example_workflow(inhabitant, manager, selected_zone)

    # Mostrar resultados
    print("=" * 60)
    print("FLUJO DE RESERVACIÓN COMPLETADO")
    print("=" * 60)

    print(f"Residente: {inhabitant.full_name}")
    print(f"Administrador: {manager.full_name}")
    print(f"Zona: {selected_zone.name}")
    print()

    print("RESERVA CREADA")
    print(f"  Solicitud de: {reservation.requester.full_name}")
    print(f"  Estado: {reservation.state}")
    print(f"  Precio Total: {reservation.total_price}")
    print(f"  Fecha de Creación: {reservation.registered_at}")
    print()

    print("RESERVA APROBADA")
    print(f"  Estado: {approved_reservation.state}")
    print(f"  Aprobada por: {approved_reservation.approved_by.full_name}")
    print(f"  Fecha de Aprobación: {approved_reservation.approved_at}")
    print(f"  Reservado por: {approved_reservation.requester.full_name}")
    print(f"  Periodo de Reserva: {approved_reservation.start_date} a {approved_reservation.end_date}")
    print()

    print("AUDITORÍA")
    print(f"  Logs del residente: {len(inhabitant.audit_logs)}")
    print("DETALLE DE LOGS DEL RESIDENTE")
    for index, log in enumerate(inhabitant.audit_logs, start=1):
        print(
            f"  {index}. {log.action} "
            f"sobre {log.entity_name} "
            f"({log.details})"
        )
    print()
    print(f"  Logs del administrador: {len(manager.audit_logs)}")
    print("DETALLE DE LOGS DEL ADMINISTRADOR")
    for index, log in enumerate(manager.audit_logs, start=1):
        print(
            f"  {index}. {log.action} "
            f"sobre {log.entity_name} "
            f"({log.details})"
        )
    print()
    print("=" * 60)