from dataclasses import dataclass, field
from typing import Optional

from .user import Inhabitant
from .zone import Zone


@dataclass
class Property:
    property_id: int
    name: str
    description: Optional[str] = None
    units: list["PropertyUnit"] = field(default_factory=list)
    zones: list["Zone"] = field(default_factory=list)

@dataclass
class PropertyUnit:
    propertyunit_id: int
    unit_name: str
    description: Optional[str] = None
    occupied: bool = False
    is_active: bool = False
    inhabitants: list["Inhabitant"] = field(default_factory=list)