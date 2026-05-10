from decimal import Decimal
from datetime import datetime

from django.db import transaction
from django.db.models import Max
from django.utils import timezone
from rest_framework import serializers

from apps.orders.models import DeliveryDetail, Order, OrderProducts
from apps.products.models import Product


class OrderItems(serializers.Serializer):
    id = serializers.IntegerField(
        required=True,
        error_messages={
            "required": "El ID del producto es requerido",
            "invalid": "El ID del producto debe ser un numero",
        },
    )
    quantity = serializers.IntegerField(
        min_value=1,
        required=True,
        error_messages={
            "required": "La cantidad es requerida",
            "min_value": "La cantidad debe ser al menos 1",
            "invalid": "La cantidad debe ser un numero",
        },
    )


class OrderSerializer(serializers.Serializer):
    client_name = serializers.CharField(
        max_length=50,
        allow_blank=False,
        required=True,
        error_messages={
            "blank": "El nombre del Cliente no puede estar vacio",
            "required": "El nombre del Cliente es requerido",
            "max_length": "El nombre del cliente es muy largo",
        },
    )
    type = serializers.ChoiceField(choices=Order.OrderType.choices, required=True)
    reserved_at = serializers.TimeField(required=False, allow_null=True)
    client_phone = serializers.CharField(required=False, allow_blank=True, max_length=20)
    address = serializers.CharField(required=False, allow_blank=True)
    reference_note = serializers.CharField(required=False, allow_blank=True)
    order = OrderItems(
        many=True,
        required=True,
        error_messages={
            "required": "Los productos de la orden son requeridos",
            "empty": "La orden no puede estar vacia",
        },
    )
    order_number = serializers.IntegerField(read_only=True)

    def validate(self, data):
        if "order" not in data or not data["order"]:
            raise serializers.ValidationError("La orden no puede estar vacia")

        items = data["order"]
        for item in items:
            product_id = item.get("id")
            if not Product.objects.filter(id=product_id).exists():
                raise serializers.ValidationError(
                    "Hay errores en los productos de la orden"
                )

        if data.get("type") == Order.OrderType.DELIVERY:
            if not data.get("client_phone"):
                raise serializers.ValidationError(
                    {"client_phone": "El número del cliente es obligatorio para envío"}
                )
            if not data.get("address"):
                raise serializers.ValidationError(
                    {"address": "La dirección es obligatoria para envío"}
                )

        return data

    def create(self, validated_data):
        items = validated_data.pop("order")

        with transaction.atomic():
            today = timezone.localdate()
            max_order_number = Order.objects.filter(created_date=today).aggregate(
                max_order_number=Max("order_number")
            )["max_order_number"]
            order_number = (max_order_number or 0) + 1

            reserved_time = validated_data.get("reserved_at")
            reserved_at = None
            if reserved_time is not None:
                local_datetime = datetime.combine(today, reserved_time)
                reserved_at = timezone.make_aware(
                    local_datetime, timezone.get_current_timezone()
                )

            order = Order.objects.create(
                client_name=validated_data["client_name"],
                total=0,
                order_number=order_number,
                type=validated_data["type"],
                reserved_at=reserved_at,
                user=validated_data.get("user"),
            )
            total = Decimal("0.00")
            for item in items:
                product = Product.objects.get(id=item["id"])
                quantity = item["quantity"]
                subtotal = product.price * quantity

                OrderProducts.objects.create(
                    order=order, product=product, quantity=quantity, subtotal=subtotal
                )
                total += subtotal

            if validated_data["type"] == Order.OrderType.DELIVERY:
                DeliveryDetail.objects.create(
                    order=order,
                    client_phone=validated_data.get("client_phone", ""),
                    address=validated_data.get("address", ""),
                    reference_note=validated_data.get("reference_note", ""),
                )

        order.total = total
        order.save()
        return order

    def update(self, instance, validated_data):
        items = validated_data.pop("order")

        with transaction.atomic():
            today = timezone.localdate()

            reserved_time = validated_data.get("reserved_at")
            reserved_at = None
            if reserved_time is not None:
                local_datetime = datetime.combine(today, reserved_time)
                reserved_at = timezone.make_aware(
                    local_datetime, timezone.get_current_timezone()
                )

            instance.client_name = validated_data["client_name"]
            instance.type = validated_data["type"]
            instance.reserved_at = reserved_at
            instance.save()

            if instance.type == Order.OrderType.DELIVERY:
                DeliveryDetail.objects.update_or_create(
                    order=instance,
                    defaults={
                        "client_phone": validated_data.get("client_phone", ""),
                        "address": validated_data.get("address", ""),
                        "reference_note": validated_data.get("reference_note", ""),
                    },
                )
            else:
                DeliveryDetail.objects.filter(order=instance).delete()

            OrderProducts.objects.filter(order=instance).delete()

            total = Decimal("0.00")
            for item in items:
                product = Product.objects.get(id=item["id"])
                quantity = item["quantity"]
                subtotal = product.price * quantity

                OrderProducts.objects.create(
                    order=instance,
                    product=product,
                    quantity=quantity,
                    subtotal=subtotal,
                )
                total += subtotal

            instance.total = total
            instance.save()

        return instance


class ProductItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source="product.id", read_only=True)
    name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderProducts
        fields = ("id", "name", "quantity", "subtotal")


class OrderListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = (
            "id",
            "order_number",
            "client_name",
            "total",
            "type",
            "status",
            "reserved_at",
            "ready_at",
            "items",
        )

    items = ProductItemSerializer(many=True, read_only=True)


class OrderDetailSerializer(serializers.ModelSerializer):
    items = ProductItemSerializer(many=True, read_only=True)
    client_phone = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    reference_note = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            "id",
            "order_number",
            "client_name",
            "type",
            "reserved_at",
            "status",
            "items",
            "client_phone",
            "address",
            "reference_note",
        )

    def _get_delivery_detail(self, obj):
        return DeliveryDetail.objects.filter(order=obj).first()

    def get_client_phone(self, obj):
        delivery_detail = self._get_delivery_detail(obj)
        return delivery_detail.client_phone if delivery_detail else None

    def get_address(self, obj):
        delivery_detail = self._get_delivery_detail(obj)
        return delivery_detail.address if delivery_detail else None

    def get_reference_note(self, obj):
        delivery_detail = self._get_delivery_detail(obj)
        return delivery_detail.reference_note if delivery_detail else None
