from dataclasses import dataclass
from typing import Optional


@dataclass
class Property:
    property_id: int
    name: str
    description: Optional[str] = None
    units: list["PropertyUnit"] = None

@dataclass
class PropertyUnit:
    propertyunit_id: int
    unit_number: str
    occupied: bool = False
    is_active: bool = False