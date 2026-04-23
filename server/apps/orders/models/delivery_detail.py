from django.db import models

from apps.base.models import BaseModel
from apps.orders.models import Order


class DeliveryDetail(BaseModel):
    """Model definition for DeliveryDetail."""

    # TODO: Define fields here
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name="Orden")
    client_phone = models.CharField("Numero del Cliente", max_length=10)
    address = models.TextField("Direccion")
    reference_note = models.TextField("Nota de referencia")

    class Meta:
        """Meta definition for DeliveryDetail."""

        verbose_name = "Detalle de Envio"
        verbose_name_plural = "Detalles de Envios"

    def __str__(self):
        """Unicode representation of DeliveryDetail."""
        return self.address
