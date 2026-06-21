from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator

from apps.base.models import BaseModel
from apps.inventory.models.raw_material import RawMaterial


class InventoryMovement(BaseModel):
    """Model definition for InventoryMovement."""

    class MovementType(models.TextChoices):
        PURCHASE = "PURCHASE", "Compra"
        SALE_CONSUMPTION = "SALE_CONSUMPTION", "Consumo por Venta"
        WASTE = "WASTE", "Merma"
        ADJUSTMENT_IN = "ADJUSTMENT_IN", "Ajuste de Entrada"
        ADJUSTMENT_OUT = "ADJUSTMENT_OUT", "Ajuste de Salida"

    raw_material = models.ForeignKey(
        RawMaterial,
        on_delete=models.PROTECT,
        related_name="inventory_movements",
        verbose_name="Materia prima",
    )
    quantity = models.DecimalField(
        "Cantidad",
        max_digits=12,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0001"))],
    )
    movement_type = models.CharField(
        "Tipo de movimiento",
        max_length=20,
        choices=MovementType.choices,
    )
    reason = models.TextField("Razón / Descripción", blank=True, default="")
    created_at = models.DateTimeField("Fecha y hora de registro", auto_now_add=True)

    class Meta:
        """Meta definition for InventoryMovement."""

        verbose_name = "Movimiento de inventario"
        verbose_name_plural = "Movimientos de inventario"
        ordering = ["-created_at"]

    def __str__(self):
        """Unicode representation of InventoryMovement."""
        return f"{self.get_movement_type_display()} - {self.raw_material.name} ({self.quantity})"
