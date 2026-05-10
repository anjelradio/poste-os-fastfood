from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

from apps.base.models import BaseModel
from apps.inventory.models import MeasureUnit, RawMaterial
from apps.products.models import Product


class Recipe(BaseModel):
    """Model definition for Recipe."""

    quantity = models.DecimalField(
        "Cantidad",
        max_digits=12,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0.0001"))],
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="recipes",
        verbose_name="Producto",
    )
    measure_unit = models.ForeignKey(
        MeasureUnit,
        on_delete=models.PROTECT,
        related_name="recipes",
        verbose_name="Unidad de medida",
    )
    raw_material = models.ForeignKey(
        RawMaterial,
        on_delete=models.PROTECT,
        related_name="recipes",
        verbose_name="Materia prima",
    )

    class Meta:
        """Meta definition for Recipe."""

        verbose_name = "Receta"
        verbose_name_plural = "Recetas"
        constraints = [
            models.UniqueConstraint(
                fields=["product", "raw_material"],
                name="unique_product_raw_material_recipe",
            )
        ]

    def __str__(self):
        """Unicode representation of Recipe."""
        return f"{self.product.name} - {self.raw_material.name} ({self.quantity} {self.measure_unit.code})"
