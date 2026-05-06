from django.db import models


class Supplier(models.Model):
    bussines_name = models.CharField(
        "Nombre del negocio",
        max_length=100,
        null=False,
        blank=False,
    )
    contact_name = models.CharField(
        "Nombre de contacto",
        max_length=100,
        null=False,
        blank=False,
    )
    phone = models.CharField(
        "Telefono",
        max_length=30,
        null=False,
        blank=False,
    )
    email = models.EmailField(
        "Correo electronico",
        max_length=254,
        null=False,
        blank=False,
    )
    state = models.BooleanField("Estado", default=True)
    created_date = models.DateField(
        "Fecha de creacion",
        auto_now=False,
        auto_now_add=True,
    )
    modified_date = models.DateField(
        "Fecha de modificacion",
        auto_now=True,
        auto_now_add=False,
    )
    deleted_date = models.DateField(
        "Fecha de eliminacion",
        null=True,
        blank=True,
        default=None,
    )

    class Meta:
        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores"

    def __str__(self):
        return self.bussines_name
