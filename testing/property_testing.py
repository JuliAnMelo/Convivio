from service.property_service import create_property, create_propertyunit


def example_workflow():
    # 1. Crear Copropiedad
    property = create_property(
        name="Torre Rotterdam",
        description="Kr 13 N° 7A-65",
    )

    # 2. Crear Unidades Residenciales
    unit_01 = create_propertyunit(
        property=property,
        unit_name="Unit 101",
        description="Apartamento 101",
    )

    unit_02 = create_propertyunit(
        property=property,
        unit_name="Unit 102",
        description="Apartamento 102",
    )

    unit_03 = create_propertyunit(
        property=property,
        unit_name="Unit 103",
        description="Apartamento 103",
    )

    units = [unit_01, unit_02, unit_03]

    return property, units


if __name__ == "__main__":
    # Ejecutar el flujo completo
    property, units = example_workflow()

    # Mostrar resultados
    print("=" * 60)
    print("FLUJO DE CREACIÓN DE COPROPIEDAD")
    print("=" * 60)

    print("COPROPIEDAD CREADA")
    print(f"  Nombre: {property.name}")
    print(f"  Descripción: {property.description}")
    print()

    print("UNIDADES CREADAS")
    for index, unit in enumerate(property.units, start=1):
        print(
            f"  {unit.unit_name}: "
            f"{unit.description}"
        )
    print()
    print("=" * 60)