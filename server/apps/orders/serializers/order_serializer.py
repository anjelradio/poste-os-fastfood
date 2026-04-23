from decimal import Decimal

from django.db import transaction
from django.db.models import Max
from django.utils import timezone
from rest_framework import serializers

from apps.orders.models import Order, OrderProducts
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
    total = serializers.DecimalField(
        max_digits=9,
        decimal_places=2,
        required=True,
        error_messages={
            "required": "El total es requerido",
            "invalid": "El total debe ser un numero valido",
        },
    )
    type = serializers.ChoiceField(choices=Order.OrderType.choices, required=True)
    reserved_at = serializers.DateTimeField(required=False, allow_null=True)
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
        return data

    def create(self, validated_data):
        items = validated_data.pop("order")

        with transaction.atomic():
            today = timezone.localdate()
            max_order_number = Order.objects.filter(created_date=today).aggregate(
                max_order_number=Max("order_number")
            )["max_order_number"]
            order_number = (max_order_number or 0) + 1
            order = Order.objects.create(
                client_name=validated_data["client_name"],
                total=0,
                order_number=order_number,
                type=validated_data["type"],
                reserved_at=validated_data.get("reserved_at"),
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

        order.total = total
        order.save()
        return order


class ProductItemSerializer(serializers.ModelSerializer):
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
