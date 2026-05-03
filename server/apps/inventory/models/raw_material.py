from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

from apps.base.models import BaseModel
from apps.inventory.models import MeasureUnit
from apps.products.models import Category


class RawMaterial(BaseModel):
    """Model definition for RawMaterial."""

    name = models.CharField("Nombre", max_length=50, unique=True)
    stock = models.DecimalField(
        "Stock",
        max_digits=12,
        decimal_places=4,
        validators=[MinValueValidator(Decimal("0"))],
    )
    min_stock = models.DecimalField(
        "Stock minimo",
        max_digits=12,
        decimal_places=4,
        default=0,
        validators=[MinValueValidator(Decimal("0"))],
    )
    measure_unit = models.ForeignKey(
        MeasureUnit,
        on_delete=models.PROTECT,
        related_name="raw_materials",
        verbose_name="Unidad de medida",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="raw_materials",
        verbose_name="Categoria",
    )

    class Meta:
        """Meta definition for RawMaterial."""

        verbose_name = "Materia Prima"
        verbose_name_plural = "Materias Primas"

    def __str__(self):
        """Unicode representation of RawMaterial."""
        return self.name
