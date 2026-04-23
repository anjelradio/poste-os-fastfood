from django.db import models

from apps.base.models import BaseModel

from . import Category


class Product(BaseModel):
    """Model definition for Product."""

    # TODO: Define fields here
    name = models.CharField(
        "Nombre", max_length=100, unique=True, blank=False, null=False
    )
    price = models.DecimalField("Precio", max_digits=6, decimal_places=2)
    image = models.URLField("Imagen", blank=True, null=True)
    slug = models.SlugField(
        "Slug", unique=True, max_length=100, null=False, blank=False
    )
    has_recipe = models.BooleanField("Tiene Receta", default=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, verbose_name="Categoria del Producto"
    )

    class Meta:
        """Meta definition for Product."""

        verbose_name = "Producto"
        verbose_name_plural = "Productos"

    def __str__(self):
        """Unicode representation of Product."""
        return self.name
