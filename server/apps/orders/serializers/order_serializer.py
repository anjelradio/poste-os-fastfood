from decimal import Decimal
from datetime import datetime

from django.db import transaction
from django.db.models import Max
from django.utils import timezone
from rest_framework import serializers

from apps.inventory.services import InventoryService
from apps.orders.models import Client, DeliveryDetail, Order, OrderProducts, Invoice
from apps.orders.services.invoice_service import InvoiceService
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


class InvoiceDataSerializer(serializers.Serializer):
    nit = serializers.CharField(max_length=30, required=True)
    payment_type = serializers.ChoiceField(choices=Invoice.PaymentType.choices, required=True)
    email = serializers.EmailField(required=False, allow_blank=True)



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
    invoice = InvoiceDataSerializer(required=True)
    order_number = serializers.IntegerField(read_only=True)

    def _resolve_client(self, client_name: str):
        normalized_name = (client_name or "").strip()
        client = Client.objects.filter(name=normalized_name, state=True).first()
        if client:
            return client

        return Client.objects.create(name=normalized_name)

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

        # Validar que haya stock suficiente para todos los productos
        InventoryService.validate_stock(data["order"])

        return data

    def create(self, validated_data):
        invoice_data = validated_data.pop("invoice")
        items = validated_data.pop("order")
        client_name = validated_data["client_name"]

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

            client = self._resolve_client(client_name)

            order = Order.objects.create(
                client=client,
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

            # Descontar materia prima del inventario
            InventoryService.consume_stock(order, items)

            if validated_data["type"] == Order.OrderType.DELIVERY:
                DeliveryDetail.objects.create(
                    order=order,
                    client_phone=validated_data.get("client_phone", ""),
                    address=validated_data.get("address", ""),
                    reference_note=validated_data.get("reference_note", ""),
                )

        order.total = total
        order.save()
        
        # Crear la factura asociada
        invoice = Invoice.objects.create(
            order=order,
            nit=invoice_data['nit'],
            email=invoice_data.get('email', '') or '',
            payment_type=invoice_data['payment_type'],
            total=order.total,
        )

        # Generar el PDF
        pdf_bytes = InvoiceService.build_invoice_pdf(order, invoice)
        
        # Enviar email si hay un correo
        if invoice.email:
            InvoiceService.send_invoice_email(invoice.email, pdf_bytes, order)
            
        # Adjuntar temporalmente los bytes del PDF al objeto orden para que la vista lo retorne
        order._invoice_pdf = pdf_bytes

        return order

    def update(self, instance, validated_data):
        items = validated_data.pop("order")
        client_name = validated_data["client_name"]

        with transaction.atomic():
            today = timezone.localdate()

            reserved_time = validated_data.get("reserved_at")
            reserved_at = None
            if reserved_time is not None:
                local_datetime = datetime.combine(today, reserved_time)
                reserved_at = timezone.make_aware(
                    local_datetime, timezone.get_current_timezone()
                )

            client = self._resolve_client(client_name)

            instance.client = client
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
    client_name = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            "id",
            "order_number",
            "created_date",
            "client_name",
            "total",
            "type",
            "status",
            "reserved_at",
            "ready_at",
            "items",
        )

    items = ProductItemSerializer(many=True, read_only=True)

    def get_client_name(self, obj):
        return obj.client.name if obj.client else ""


class OrderDetailSerializer(serializers.ModelSerializer):
    items = ProductItemSerializer(many=True, read_only=True)
    client_name = serializers.SerializerMethodField()
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

    def get_client_name(self, obj):
        return obj.client.name if obj.client else ""

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
