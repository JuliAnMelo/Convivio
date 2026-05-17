from datetime import datetime
from typing import Optional

from domain.user import Inhabitant, Manager
from domain.property import PropertyUnit

from service.audit_service import create_audit_log


def create_inhabitant(
    unit: "PropertyUnit",   # This is a forward reference to avoid circular imports
    full_name: str,
    document_number: str,
    birth_date: datetime,
    email: str,
    phone: str,
    password_hash: str,
    is_owner: bool,
    move_in_date: Optional[datetime] = None,
):
    inhabitant = Inhabitant(
        user_id=None,   # This would be set by the database
        full_name=full_name,
        email=email,
        phone=phone,
        password_hash=password_hash,
        created_at=datetime.now(),  # Automatically set to current time
        is_active=True,
        document_number=document_number,
        birth_date=birth_date,
        move_in_date=move_in_date,
        is_owner=is_owner,
    )

    first_log = create_audit_log(
        user=inhabitant,
        action="CREATE_USER",
        entity_name="Inhabitant",
        entity_id=inhabitant.user_id,
        details="El residente ha sido creado en el sístema",
    )

    unit.inhabitants.append(inhabitant)
    inhabitant.audit_logs.append(first_log)

    return inhabitant

def create_manager(
    full_name: str,
    employee_code: str,
    email: str,
    phone: str,
    password_hash: str,
    office_phone: Optional[str] = None,
):
    manager = Manager(
        user_id=None,   # This would be set by the database
        full_name=full_name,
        email=email,
        phone=phone,
        password_hash=password_hash,
        created_at=datetime.now(),  # Automatically set to current time
        is_active=True,
        employee_code=employee_code,
        office_phone=office_phone,
    )

    return manager