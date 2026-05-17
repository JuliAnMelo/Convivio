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
    unit_name="101",
    occupied=True,
    is_active=True
)

unit_102 = PropertyUnit(
    propertyunit_id=102,
    unit_name="102",
    occupied=False,
    is_active=True
)

unit_201 = PropertyUnit(
    propertyunit_id=201,
    unit_name="201",
    occupied=True,
    is_active=True
)

unit_202 = PropertyUnit(
    propertyunit_id=202,
    unit_name="202",
    occupied=True,
    is_active=True,
)

unit_301 = PropertyUnit(
    propertyunit_id=301,
    unit_name="301",
    occupied=True,
    is_active=True,
)

unit_302 = PropertyUnit(
    propertyunit_id=302,
    unit_name="302",
    occupied=False,
    is_active=False,
)

building_a.units = [
    unit_101,
    unit_102,
    unit_201,
    unit_202,
    unit_301,
    unit_302,
]


DUMMY_BUILDINGS = [building_a]

DUMMY_UNITS = [
    unit_101,
    unit_102,
    unit_201,
    unit_202,
    unit_301,
    unit_302,
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

zone_2 = Zone(
    zone_id=1,
    name="Pool",
    description="Piscina climatizada",
    capacity=15,
    price=Decimal("120000.00"),
    available=True,
    reservation_limit_hours=4,
    is_active=True,
)

DUMMY_ZONES = [zone_1, zone_2]


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
    )

inhabitant_02 = Inhabitant(
    user_id=3,
    full_name="Cesar Londoño",
    email="cesar@example.com",
    phone="3001234567",
    password_hash="hashed_password",
    is_active=True,
    created_at=datetime.now(),
    last_login=None,
    document_number="123456789",
    birth_date=datetime(1998, 5, 15).date(),
    move_in_date=datetime(2024, 1, 10).date(),
    is_owner=True,
)

inhabitant_03 = Inhabitant(
    user_id=4,
    full_name="Martín Francisco",
    email="martin@example.com",
    phone="3114304797",
    password_hash="hashed_password",
    is_active=True,
    created_at=datetime.now(),
    last_login=None,
    document_number="123456789",
    birth_date=datetime(2003, 5, 26).date(),
    move_in_date=datetime(2022, 3, 12).date(),
    is_owner=True,
)

inhabitant_04 = Inhabitant(
    user_id=4,
    full_name="Carlos Velez",
    email="carlos@example.com",
    phone="3124330555",
    password_hash="hashed_password",
    is_active=True,
    created_at=datetime.now(),
    last_login=None,
    document_number="123456789",
    birth_date=datetime(1962, 3, 19).date(),
    move_in_date=datetime(2016, 7, 1).date(),
    is_owner=True,
)

DUMMY_INHABITANTS = [inhabitant_01, inhabitant_02, inhabitant_03, inhabitant_04]

# assign inhabitants to their units (PropertyUnit now owns inhabitants)
unit_101.inhabitants.append(inhabitant_01)
unit_201.inhabitants.append(inhabitant_02)
unit_202.inhabitants.append(inhabitant_03)
unit_301.inhabitants.append(inhabitant_04)