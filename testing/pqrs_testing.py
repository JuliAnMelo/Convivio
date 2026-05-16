from service.pqrs_service import PQRStype, create_pqrs, answer_pqrs
from service.audit_service import create_audit_log
from repository.dummy_data import DUMMY_UNITS, DUMMY_MANAGER, DUMMY_INHABITANTS


def example_workflow(inhabitant, manager):
    # 1. Crear PQRS
    pqrs = create_pqrs(
        inhabitant=inhabitant,
        title="Ruido excesivo en zona social",
        description="Se presenta ruido después del horario permitido.",
        pqrs_type=PQRStype.QUEJA,  # Tipo de PQRS
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
    # Seleccionar una unidad existente para asociar al residente
    selected_unit = DUMMY_UNITS[0]

    # Crear un residente (Inhabitant)
    inhabitant = DUMMY_INHABITANTS[0]

    # Crear un administrador (Manager)
    manager = DUMMY_MANAGER

    # Ejecutar el flujo completo
    pqrs, answer = example_workflow(inhabitant, manager)

    # Mostrar resultados
    print("=" * 60)
    print("FLUJO DE PQRS RESIDENTE-ADMINISTRADOR")
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