from domain.property import Property, PropertyUnit


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


if __name__ == "__main__":
    print(f"Building: {building_a.name}")
    print(f"Total units: {len(building_a.units)}")

    for unit in building_a.units:
        status = "Occupied" if unit.occupied else "Available"
        print(
            f"Unit {unit.unit_number} | "
            f"{status}"
        )