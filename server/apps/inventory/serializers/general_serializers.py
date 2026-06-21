from rest_framework import serializers

from apps.inventory.models import MeasureUnit, RawMaterial, InventoryMovement
from apps.products.models import Category
from apps.products.models.category import CategoryType
from apps.products.serializers import CategorySerializer


class MeasureUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasureUnit
        fields = ("id", "name", "code")


class RawMaterialSerializer(serializers.ModelSerializer):
    measure_unit = serializers.PrimaryKeyRelatedField(
        queryset=MeasureUnit.objects.filter(state=True)
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(state=True, type=CategoryType.RAW_MATERIAL)
    )

    class Meta:
        model = RawMaterial
        fields = ("id", "name", "stock", "min_stock", "measure_unit", "category")


class RawMaterialListSerializer(serializers.ModelSerializer):
    measure_unit = MeasureUnitSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = RawMaterial
        fields = ("id", "name", "stock", "min_stock", "measure_unit", "category")


class InventoryMovementSerializer(serializers.ModelSerializer):
    raw_material_name = serializers.CharField(source="raw_material.name", read_only=True)
    movement_type_display = serializers.CharField(source="get_movement_type_display", read_only=True)

    class Meta:
        model = InventoryMovement
        fields = (
            "id",
            "raw_material_name",
            "quantity",
            "movement_type",
            "movement_type_display",
            "reason",
            "created_at",
        )

