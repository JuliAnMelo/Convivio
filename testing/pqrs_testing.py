from datetime import date
from repository.dummy_data import DUMMY_UNITS
from domain.user import Inhabitant, Manager
from service.pqrs_service import PQRStype, create_pqrs, answer_pqrs, create_audit_log

def example_workflow(inhabitant, manager):
    # 1. Crear PQRS
    pqrs = create_pqrs(
        inhabitant=inhabitant,
        title="Ruido excesivo en zona social",
        description="Se presenta ruido después del horario permitido.",
        pqrs_type=PQRStype.queja,  # Tipo de PQRS
    )

    # 2. Auditoría de creación
    create_audit_log(
        user=inhabitant,
        action="CREATE_PQRS",
        entity_name="PQRS",
        entity_id=pqrs.communication_id,
        details="El residente registró una nueva queja.",
    )

    # 3. Respuesta del administrador
    answer = answer_pqrs(
        manager=manager,
        pqrs=pqrs,
        title="Respuesta a su PQRS",
        description="Se notificará al comité de convivencia.",
    )

    # 4. Auditoría de respuesta
    create_audit_log(
        user=manager,
        action="ANSWER_PQRS",
        entity_name="Answer",
        entity_id=answer.communication_id,
        details="El administrador respondió la PQRS.",
    )

    return pqrs, answer


if __name__ == "__main__":
    # ==========================================================
    # Datos de prueba
    # ==========================================================
    # Se asume que existe el módulo dummy_data.py con:
    # - DUMMY_BUILDINGS
    # - DUMMY_UNITS
    # y que ya están definidas las clases:
    # - Inhabitant
    # - Manager
    
    # ----------------------------------------------------------
    # Seleccionar una unidad existente para asociar al residente
    # ----------------------------------------------------------
    selected_unit = DUMMY_UNITS[0]

    # ----------------------------------------------------------
    # Crear un residente (Inhabitant)
    # ----------------------------------------------------------
    inhabitant = Inhabitant(
        user_id=1,
        full_name="Juan Pérez",
        email="juan.perez@example.com",
        phone="3001234567",
        password_hash="hashed_password",
        is_active=True,
        created_at=date.today(),
        last_login=None,
        document_number="123456789",
        birth_date=date(1990, 5, 15),
        move_in_date=date.today(),
        is_owner=True,
        propertyunit=selected_unit,
    )

    # ----------------------------------------------------------
    # Crear un administrador (Manager)
    # ----------------------------------------------------------
    manager = Manager(
        user_id=2,
        full_name="Laura Gómez",
        email="laura.gomez@example.com",
        phone="3019876543",
        password_hash="hashed_password",
        is_active=True,
        created_at=date.today(),
        last_login=None,
        employee_code="ADM001",
        office_phone="6015551234",
        subordinates=[],
    )

    # ----------------------------------------------------------
    # Ejecutar el flujo completo
    # ----------------------------------------------------------
    pqrs, answer = example_workflow(inhabitant, manager)

    # ----------------------------------------------------------
    # Mostrar resultados
    # ----------------------------------------------------------
    print("=" * 60)
    print("FLUJO DE PQRS COMPLETADO")
    print("=" * 60)

    print(f"Residente: {inhabitant.full_name}")
    print(f"Administrador: {manager.full_name}")
    print()

    print("PQRS CREADA")
    print(f"  Título: {pqrs.title}")
    print(f"  Tipo: {pqrs.pqrs_type}")
    print(f"  Estado: {pqrs.state}")
    print(f"  Autor: {pqrs.author.full_name}")
    print(f"  Total respuestas: {len(pqrs.answers)}")
    print()

    print("RESPUESTA GENERADA")
    print(f"  Título: {answer.title}")
    print(f"  Autor: {answer.author.full_name}")
    print(f"  Asociada al PQRS: {pqrs.title}")
    print()

    print("AUDITORÍA")
    print(f"  Logs del residente: {len(inhabitant.audit_logs)}")
    print(f"  Logs del administrador: {len(manager.audit_logs)}")
    print()

    print("DETALLE DE LOGS DEL ADMINISTRADOR")
    for index, log in enumerate(manager.audit_logs, start=1):
        print(
            f"  {index}. {log.action} "
            f"sobre {log.entity_name} "
            f"({log.details})"
        )