from datetime import datetime, date
from decimal import Decimal

from domain.property import Property, PropertyUnit
from domain.zone import Zone
from domain.user import Inhabitant, Manager


building_a = Property(
    property_id=1,
    name="Edificio A",
    description="Edificio principal del condominio"
)


unit_101 = PropertyUnit(
    propertyunit_id=101,
    unit_number="101",
    occupied=True,
    is_active=True
)

unit_102 = PropertyUnit(
    propertyunit_id=102,
    unit_number="102",
    occupied=False,
    is_active=True
)

unit_201 = PropertyUnit(
    propertyunit_id=201,
    unit_number="201",
    occupied=True,
    is_active=True
)

unit_202 = PropertyUnit(
    propertyunit_id=202,
    unit_number="202",
    occupied=True,
    is_active=True,
)

building_a.units = [
    unit_101,
    unit_102,
    unit_201,
    unit_202,
]


DUMMY_BUILDINGS = [building_a]

DUMMY_UNITS = [
    unit_101,
    unit_102,
    unit_201,
    unit_202,
]


zone_1 = Zone(
    zone_id=1,
    name="Social Hall",
    description="Salón social para eventos",
    capacity=80,
    price=Decimal("150000.00"),
    available=True,
    reservation_limit_hours=8,
    is_active=True,
)

DUMMY_ZONES = [zone_1]


DUMMY_MANAGER = Manager(
    user_id=1,
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


inhabitant_01 = Inhabitant(
    user_id=2,
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
    propertyunit=unit_101,
    )

inhabitant_02 = Inhabitant(
    user_id=3,
    full_name="Julian Melo",
    email="julian@example.com",
    phone="3001234567",
    password_hash="hashed_password",
    is_active=True,
    created_at=datetime.now(),
    last_login=None,
    document_number="123456789",
    birth_date=datetime(1998, 5, 15).date(),
    move_in_date=datetime(2024, 1, 10).date(),
    is_owner=True,
    propertyunit=unit_201,
)

DUMMY_INHABITANTS = [inhabitant_01, inhabitant_02]


if __name__ == "__main__":
    print(f"Building: {building_a.name}")
    print(f"Total units: {len(building_a.units)}")

    for unit in building_a.units:
        status = "Occupied" if unit.occupied else "Available"
        print(
            f"Unit {unit.unit_number} | "
            f"{status}"
        )