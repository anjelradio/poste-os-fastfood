from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

from apps.base.models import BaseModel


class MeasureUnit(BaseModel):
    """Model definition for MeasureUnit."""

    class UnitType(models.TextChoices):
        MASS = "MASS", "Masa"
        COUNT = "COUNT", "Conteo"

    name = models.CharField("Nombre", max_length=20, unique=True)
    code = models.CharField("Codigo", max_length=10, unique=True)
    unit_type = models.CharField(
        "Tipo de unidad",
        max_length=10,
        choices=UnitType.choices,
        default=UnitType.MASS,
    )
    factor_to_base = models.DecimalField(
        "Factor de conversion",
        max_digits=12,
        decimal_places=6,
        validators=[MinValueValidator(Decimal("0.000001"))],
    )

    class Meta:
        """Meta definition for MeasureUnit."""

        verbose_name = "Unidad de medida"
        verbose_name_plural = "Unidades de medida"

    def __str__(self):
        """Unicode representation of MeasureUnit."""
        return f"{self.name} ({self.code})"
