from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from apps.inventory.models import MeasureUnit, RawMaterial
from apps.products.models import Product, Recipe


class RecipeItemInputSerializer(serializers.Serializer):
    raw_material = serializers.PrimaryKeyRelatedField(
        queryset=RawMaterial.objects.filter(state=True)
    )
    measure_unit = serializers.PrimaryKeyRelatedField(
        queryset=MeasureUnit.objects.filter(state=True)
    )
    quantity = serializers.DecimalField(
        max_digits=12,
        decimal_places=4,
        min_value=Decimal("0.0001"),
    )


class RecipeSerializer(serializers.Serializer):
    items = RecipeItemInputSerializer(many=True)

    def upsert(self, *, product: Product):
        items = self.validated_data.get("items", [])

        with transaction.atomic():
            Recipe.objects.filter(product=product).delete()

            recipes = [
                Recipe(
                    product=product,
                    raw_material=item["raw_material"],
                    measure_unit=item["measure_unit"],
                    quantity=item["quantity"],
                )
                for item in items
            ]

            if recipes:
                Recipe.objects.bulk_create(recipes)

        return Recipe.objects.filter(product=product).select_related(
            "raw_material", "measure_unit"
        )


class RecipeItemListSerializer(serializers.ModelSerializer):
    raw_material_id = serializers.IntegerField(source="raw_material.id", read_only=True)
    raw_material_name = serializers.CharField(source="raw_material.name", read_only=True)
    measure_unit_id = serializers.IntegerField(source="measure_unit.id", read_only=True)
    measure_unit_name = serializers.CharField(source="measure_unit.name", read_only=True)

    class Meta:
        model = Recipe
        fields = (
            "id",
            "raw_material_id",
            "raw_material_name",
            "measure_unit_id",
            "measure_unit_name",
            "quantity",
        )
