from django.db import models

from apps.base.models import BaseModel


class Supplier(BaseModel):
    """Model definition for Supplier."""

    # TODO: Define fields here
    business_name = models.CharField("Razon Social", max_length=100)
    contact_name = models.CharField("Nombre de Contacto", max_length=80)
    phone = models.CharField("Telefono", max_length=20)
    email = models.EmailField("Correo", max_length=254)

    class Meta:
        """Meta definition for Supplier."""

        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores"

    def __str__(self):
        """Unicode representation of Proveedor."""
        return self.bussines_name
