from django.db import models
from apps.base.models import BaseModel
from apps.orders.models.order import Order

class Invoice(BaseModel):
    class PaymentType(models.TextChoices):
        CASH = "CASH", "Efectivo"
        QR = "QR", "QR"
        CARD = "CARD", "Tarjeta"

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="invoice", verbose_name="Orden")
    nit = models.CharField("NIT", max_length=30)
    email = models.EmailField("Correo electrónico", blank=True, null=True)
    payment_type = models.CharField("Tipo de pago", max_length=10, choices=PaymentType.choices)
    total = models.DecimalField("Total", max_digits=9, decimal_places=2, default=0)

    class Meta:
        verbose_name = "Factura"
        verbose_name_plural = "Facturas"

    def __str__(self):
        return f"Factura #{self.id} - Orden #{self.order.order_number}"
