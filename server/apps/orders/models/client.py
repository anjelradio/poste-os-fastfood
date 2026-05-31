from django.db import models

from apps.base.models import BaseModel


class Client(BaseModel):
    name = models.CharField("Nombre del Cliente", max_length=100, db_index=True)
    nit = models.CharField("NIT", max_length=30, null=True, blank=True)

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"

    def __str__(self):
        return self.name
