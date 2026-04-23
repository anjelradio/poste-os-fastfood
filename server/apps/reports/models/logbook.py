from django.db import models

from apps.base.models import BaseModel
from apps.users.models import User


class Logbook(BaseModel):
    class ActionChoices(models.TextChoices):
        LOGIN = "LOGIN", "Login"
        LOGOUT = "LOGOUT", "Logout"
        CREATE = "CREATE", "Create"
        UPDATE = "UPDATE", "Update"
        DELETE = "DELETE", "Delete"

    class AreaChoices(models.TextChoices):
        CAJA = "CAJA", "Cashier"
        COCINA = "COCINA", "Kitchen"
        ADMINISTRATION = "ADMINISTRATION", "Administration"

    time = models.TimeField(blank=False, null=False)
    action = models.CharField("Accion", max_length=10, choices=ActionChoices.choices)
    description = models.TextField("Descripcion")
    ip_address = models.GenericIPAddressField("Direccion IP", null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Usuario de la Bitacora")
    area = models.CharField(
        "Area", max_length=15, choices=AreaChoices.choices, default=AreaChoices.CAJA
    )

    class Meta:
        verbose_name = "Bitacora"
        verbose_name_plural = "Bitacoras"

    def __str__(self):
        return self.description
