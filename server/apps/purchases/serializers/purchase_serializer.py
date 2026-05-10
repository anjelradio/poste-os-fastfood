from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.inventory.models import RawMaterial
from apps.purchases.models import Purchase, PurchaseDetail, Supplier


class PurchaseItemsSerializer(serializers.Serializer):
    raw_material_id = serializers.IntegerField(
        required=True,
        error_messages={
            "required": "El ID de la materia prima es requerido",
            "invalid": "El ID de la materia prima debe ser un numero",
        },
    )
    quantity = serializers.DecimalField(
        max_digits=12,
        decimal_places=4,
        min_value=Decimal("0.0001"),
        required=True,
        error_messages={
            "required": "La cantidad es requerida",
            "invalid": "La cantidad debe ser un numero",
        },
    )
    unit_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=Decimal("0.01"),
        required=True,
        error_messages={
            "required": "El precio unitario es requerido",
            "invalid": "El precio unitario debe ser un numero",
        },
    )


class PurchaseSerializer(serializers.Serializer):
    supplier_id = serializers.IntegerField(required=True)
    description = serializers.CharField(required=False, allow_blank=True, max_length=255)
    items = PurchaseItemsSerializer(many=True, required=True)

    def validate(self, data):
        supplier_id = data.get("supplier_id")
        if not Supplier.objects.filter(id=supplier_id, state=True).exists():
            raise serializers.ValidationError({"supplier_id": "Proveedor no encontrado"})

        items = data.get("items") or []
        if len(items) == 0:
            raise serializers.ValidationError({"items": "La compra debe tener al menos un item"})

        raw_material_ids = [item.get("raw_material_id") for item in items]
        existing_ids = set(
            RawMaterial.objects.filter(id__in=raw_material_ids, state=True).values_list(
                "id", flat=True
            )
        )

        for raw_material_id in raw_material_ids:
            if raw_material_id not in existing_ids:
                raise serializers.ValidationError(
                    {"items": f"Materia prima no encontrada: {raw_material_id}"}
                )

        return data

    def create(self, validated_data):
        items = validated_data.pop("items")

        with transaction.atomic():
            purchase = Purchase.objects.create(
                description=validated_data.get("description", ""),
                supplier=Supplier.objects.get(id=validated_data["supplier_id"], state=True),
                purchased_at=timezone.now(),
                total=0,
            )

            total = Decimal("0.00")
            for item in items:
                raw_material = RawMaterial.objects.get(id=item["raw_material_id"], state=True)
                quantity = item["quantity"]
                unit_price = item["unit_price"]
                subtotal = unit_price * quantity

                PurchaseDetail.objects.create(
                    purchase=purchase,
                    raw_material=raw_material,
                    quantity=quantity,
                    unit_price=unit_price,
                )
                total += subtotal

            purchase.total = total
            purchase.save(update_fields=["total"])

        return purchase

    def update(self, instance, validated_data):
        items = validated_data.pop("items")

        with transaction.atomic():
            instance.description = validated_data.get("description", "")
            instance.supplier = Supplier.objects.get(id=validated_data["supplier_id"], state=True)
            instance.save(update_fields=["description", "supplier"])

            PurchaseDetail.objects.filter(purchase=instance).delete()

            total = Decimal("0.00")
            for item in items:
                raw_material = RawMaterial.objects.get(id=item["raw_material_id"], state=True)
                quantity = item["quantity"]
                unit_price = item["unit_price"]
                subtotal = unit_price * quantity

                PurchaseDetail.objects.create(
                    purchase=instance,
                    raw_material=raw_material,
                    quantity=quantity,
                    unit_price=unit_price,
                )
                total += subtotal

            instance.total = total
            instance.save(update_fields=["total"])

        return instance


class PurchaseItemListSerializer(serializers.ModelSerializer):
    raw_material_id = serializers.IntegerField(source="raw_material.id", read_only=True)
    raw_material_name = serializers.CharField(source="raw_material.name", read_only=True)
    measure_unit = serializers.CharField(source="raw_material.measure_unit.name", read_only=True)

    class Meta:
        model = PurchaseDetail
        fields = (
            "id",
            "raw_material_id",
            "raw_material_name",
            "measure_unit",
            "quantity",
            "unit_price",
        )


class PurchaseListSerializer(serializers.ModelSerializer):
    items = PurchaseItemListSerializer(many=True, read_only=True)
    supplier_id = serializers.IntegerField(source="supplier.id", read_only=True)
    supplier_name = serializers.CharField(source="supplier.business_name", read_only=True)

    class Meta:
        model = Purchase
        fields = (
            "id",
            "description",
            "supplier_id",
            "supplier_name",
            "purchased_at",
            "total",
            "items",
        )


class PurchaseDetailSerializer(serializers.ModelSerializer):
    items = PurchaseItemListSerializer(many=True, read_only=True)
    supplier_id = serializers.IntegerField(source="supplier.id", read_only=True)
    supplier_name = serializers.CharField(source="supplier.business_name", read_only=True)

    class Meta:
        model = Purchase
        fields = (
            "id",
            "description",
            "supplier_id",
            "supplier_name",
            "purchased_at",
            "total",
            "items",
        )
