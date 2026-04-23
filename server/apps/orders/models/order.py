from django.db import models

from apps.base.models import BaseModel


class Order(BaseModel):
    """Model definition for Order."""

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        PREPARING = "PREPARING", "Preparing"
        READY = "READY", "Ready"

    class OrderType(models.TextChoices):
        DINE_IN = "DINE_IN", "Dine In"
        TAKEAWAY = "TAKEAWAY", "Takeaway"

    # TODO: Define fields here
    order_number = models.PositiveIntegerField(
        "Numero de orden", editable=False, blank=True, null=True, db_index=True
    )
    client_name = models.CharField("Nombre del Cliente", max_length=50, default="")
    type = models.CharField(
        "Tipo de la orden",
        max_length=15,
        choices=OrderType.choices,
        default=OrderType.DINE_IN,
    )
    reserved_at = models.DateTimeField("Fecha y hora de reserva", null=True, blank=True)
    total = models.DecimalField("Total", max_digits=9, decimal_places=2, default=0)
    status = models.CharField(
        "Estado de la orden",
        max_length=15,
        choices=Status.choices,
        default=Status.PENDING,
    )
    ready_at = models.DateTimeField("Hora de orden lista", null=True, blank=True)

    class Meta:
        """Meta definition for Order."""

        verbose_name = "Orden"
        verbose_name_plural = "Ordenes"

    def __str__(self):
        """Unicode representation of Order."""
        return f"{self.client_name} - {self.status}"
