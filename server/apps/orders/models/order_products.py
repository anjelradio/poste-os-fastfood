from django.db import models

from apps.base.models import BaseModel
from apps.orders.models import Order
from apps.products.models import Product


class OrderProducts(BaseModel):
    """Model definition for OrderProducts."""

    # TODO: Define fields here
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, verbose_name="Orden", related_name="items"
    )
    product = models.ForeignKey(
        Product, on_delete=models.PROTECT, verbose_name="Producto"
    )
    quantity = models.SmallIntegerField("Cantidad", default=1)
    subtotal = models.DecimalField(
        "Subtotal", max_digits=9, decimal_places=2, default=0
    )

    class Meta:
        """Meta definition for OrderProducts."""

        verbose_name = "Productos de la Orden"
        verbose_name_plural = "Productos de las Ordenes"

    def __str__(self):
        """Unicode representation of OrderProducts."""
        return self.product.name
