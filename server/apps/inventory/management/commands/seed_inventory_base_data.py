from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.inventory.models import MeasureUnit, RawMaterial
from apps.products.models import Category
from apps.products.models.category import CategoryType


class Command(BaseCommand):
    help = "Seed measure units and raw materials for inventory module"

    def handle(self, *args, **options):
        category, category_created = Category.objects.update_or_create(
            slug="materias-primas",
            defaults={
                "name": "Materias Primas",
                "type": CategoryType.RAW_MATERIAL,
                "state": True,
                "deleted_date": None,
            },
        )

        if category_created:
            self.stdout.write(
                self.style.SUCCESS(f"Created category: {category.name}")
            )
        else:
            self.stdout.write(
                self.style.WARNING(f"Updated category: {category.name}")
            )

        units_to_seed = [
            {
                "name": "Gramo",
                "code": "G",
                "unit_type": MeasureUnit.UnitType.MASS,
                "factor_to_base": Decimal("1"),
            },
            {
                "name": "Kilogramo",
                "code": "KG",
                "unit_type": MeasureUnit.UnitType.MASS,
                "factor_to_base": Decimal("1000"),
            },
            {
                "name": "Unidad",
                "code": "UNIT",
                "unit_type": MeasureUnit.UnitType.COUNT,
                "factor_to_base": Decimal("1"),
            },
        ]

        units_map = {}
        units_created = 0
        units_updated = 0

        for item in units_to_seed:
            unit, created = MeasureUnit.objects.update_or_create(
                code=item["code"],
                defaults={
                    "name": item["name"],
                    "unit_type": item["unit_type"],
                    "factor_to_base": item["factor_to_base"],
                    "state": True,
                    "deleted_date": None,
                },
            )

            units_map[item["code"]] = unit

            if created:
                units_created += 1
                self.stdout.write(self.style.SUCCESS(f"Created unit: {unit.code}"))
            else:
                units_updated += 1
                self.stdout.write(self.style.WARNING(f"Updated unit: {unit.code}"))

        raw_materials_to_seed = [
            {
                "name": "Carne",
                "stock": Decimal("20.0000"),
                "min_stock": Decimal("5.0000"),
                "measure_unit": units_map["KG"],
            },
            {
                "name": "Pan",
                "stock": Decimal("120.0000"),
                "min_stock": Decimal("30.0000"),
                "measure_unit": units_map["UNIT"],
            },
        ]

        raw_created = 0
        raw_updated = 0

        for item in raw_materials_to_seed:
            raw_material, created = RawMaterial.objects.update_or_create(
                name=item["name"],
                defaults={
                    "stock": item["stock"],
                    "min_stock": item["min_stock"],
                    "measure_unit": item["measure_unit"],
                    "category": category,
                    "state": True,
                    "deleted_date": None,
                },
            )

            if created:
                raw_created += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Created raw material: {raw_material.name}")
                )
            else:
                raw_updated += 1
                self.stdout.write(
                    self.style.WARNING(f"Updated raw material: {raw_material.name}")
                )

        self.stdout.write(
            self.style.SUCCESS(
                "Seed complete. "
                f"Units Created: {units_created}, Units Updated: {units_updated}, "
                f"Raw Materials Created: {raw_created}, Raw Materials Updated: {raw_updated}."
            )
        )
