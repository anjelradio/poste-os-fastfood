from django.db import models

from apps.base.models import BaseModel
from apps.inventory.models import RawMaterial

from .purchase import Purchase


class PurchaseDetail(BaseModel):
    """Model definition for PurchaseDetail."""

    purchase = models.ForeignKey(
        Purchase,
        on_delete=models.CASCADE,
        related_name="items",
        verbose_name="Compra",
    )
    raw_material = models.ForeignKey(
        RawMaterial,
        on_delete=models.PROTECT,
        verbose_name="Materia prima",
    )
    unit_price = models.DecimalField("Precio unitario", max_digits=12, decimal_places=2)
    quantity = models.DecimalField("Cantidad", max_digits=12, decimal_places=4)

    class Meta:
        """Meta definition for PurchaseDetail."""

        verbose_name = "Detalle de compra"
        verbose_name_plural = "Detalles de compra"

    def __str__(self):
        """Unicode representation of PurchaseDetail."""
        return f"{self.raw_material.name} x {self.quantity}"
