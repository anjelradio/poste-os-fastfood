from django.db import models

from apps.base.models import BaseModel


class CategoryType(models.TextChoices):
    PRODUCT = "PRODUCT", "Product"
    RAW_MATERIAL = "RAW_MATERIAL", "Raw Material"


class Category(BaseModel):
    """Model definition for Category."""

    name = models.CharField(
        "Nombre", max_length=50, null=False, blank=False, unique=True
    )
    slug = models.SlugField("Slug", max_length=50, null=False, blank=False, unique=True)
    type = models.CharField(
        "Tipo",
        max_length=20,
        choices=CategoryType.choices,
        default=CategoryType.PRODUCT,
    )

    class Meta:
        """Meta definition for Category."""

        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"

    def __str__(self):
        """Unicode representation of Category."""
        return self.name
