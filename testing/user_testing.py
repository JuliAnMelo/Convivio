from datetime import datetime, date

from service.user_service import create_inhabitant
from repository.dummy_data import DUMMY_UNITS


def example_workflow(selected_unit, new_residents):
    # 1. Crear Residentes
    for resident in new_residents:
        inhabitant = create_inhabitant(
            unit=selected_unit,
            full_name=resident[0],
            document_number=resident[1],
            birth_date=resident[2],
            email=resident[3],
            phone=resident[4],
            password_hash=resident[5],
            is_owner=resident[6],
            move_in_date=resident[7],
        )

    return selected_unit


if __name__ == "__main__":
    # Seleccionar una unidad existente para asociar al residente
    selected_unit = DUMMY_UNITS[5]

    # Datos nuevos residentes
    new_resident_01 = [
        "Gonzalo Gonzalez", 
        "123456789", 
        date(1980, 7, 5), 
        "gonzalo@example.com",
        "312456789",
        "hashed_password",
        True,
        datetime.now(),
    ]

    new_resident_02 = [
        "Hernando Hernandez", 
        "135792468", 
        date(1970, 10, 26), 
        "hernando@example.com",
        "315792468",
        "hashed_password",
        False,
        datetime.now(),
    ]

    new_resident_03 = [
        "Fernando Fernandez", 
        "246813579", 
        date(1960, 1, 16), 
        "hernando@example.com",
        "324681579",
        "hashed_password",
        False,
        datetime.now(),
    ]

    new_residents = [new_resident_01, new_resident_02, new_resident_03]

    # Ejecutar el flujo completo
    occupied_unit = example_workflow(selected_unit, new_residents)

    # Mostrar resultados
    print("=" * 60)
    print("FLUJO DE ADICIÓN DE NUEVOS RESIDENTES")
    print("=" * 60)

    for index, resident in enumerate(occupied_unit.inhabitants, start=1):
        print(
            f"  {index}. {resident.full_name} "
            f"bienvenido a Residencia {occupied_unit.unit_name}"
            f""
        )
    print()

    print("AUDITORÍA")
    for index, resident in enumerate(occupied_unit.inhabitants, start=1):
        print(
            f"  {index}. {resident.audit_logs[0].action}: "
            f"{resident.full_name} | "
            f"ID {resident.document_number} | "
            f"Tel {resident.phone} | "
            f"\n{resident.audit_logs[0].details}"
        )
    print()
    print("=" * 60)