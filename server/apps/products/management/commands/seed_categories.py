from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.products.models import Category
from apps.products.models.category import CategoryType


class Command(BaseCommand):
    help = "Seed default categories for products module"

    def handle(self, *args, **options):
        categories_to_seed = [
            {"name": "Hamburguesas", "type": CategoryType.PRODUCT},
            {"name": "Pollo Frito", "type": CategoryType.PRODUCT},
            {"name": "Lomitos", "type": CategoryType.PRODUCT},
            {"name": "Bebidas", "type": CategoryType.PRODUCT},
            {"name": "Promociones", "type": CategoryType.PRODUCT},
        ]

        created_count = 0
        updated_count = 0

        for item in categories_to_seed:
            slug = slugify(item["name"])
            category, created = Category.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": item["name"],
                    "type": item["type"],
                    "state": True,
                    "deleted_date": None,
                },
            )

            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Created category: {category.name}")
                )
                continue

            updated_count += 1
            self.stdout.write(
                self.style.WARNING(f"Updated category: {category.name}")
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete. Created: {created_count}, Updated: {updated_count}."
            )
        )
