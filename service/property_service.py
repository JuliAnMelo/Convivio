from typing import Optional

from domain.property import Property, PropertyUnit


def create_property(
    name: str,
    description: Optional[str] = None
):
    property = Property(
        property_id=None,  # This would be set by the database
        name=name,
        description=description,
    )

    return property

def create_propertyunit(
    property: "Property",   # This is a forward reference to avoid circular imports
    unit_name: str,
    description: Optional[str] = None,
):
    unit = PropertyUnit(
        propertyunit_id=None,  # This would be set by the database
        unit_name=unit_name,
        description=description,
    )
    property.units.append(unit)

    return unit