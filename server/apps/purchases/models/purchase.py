from django.db import models

from apps.base.models import BaseModel

from .supplier import Supplier


class Purchase(BaseModel):
    """Model definition for Purchase."""

    description = models.CharField("Descripcion", max_length=255, blank=True, default="")
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.PROTECT,
        related_name="purchases",
        verbose_name="Proveedor",
        null=True,
        blank=True,
    )
    purchased_at = models.DateTimeField("Fecha y hora de compra")
    total = models.DecimalField("Total de compra", max_digits=12, decimal_places=2, default=0)

    class Meta:
        """Meta definition for Purchase."""

        verbose_name = "Compra"
        verbose_name_plural = "Compras"

    def __str__(self):
        """Unicode representation of Purchase."""
        return f"Compra #{self.id} - {self.purchased_at}"
