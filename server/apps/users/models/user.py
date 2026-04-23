from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class UserManager(BaseUserManager):
    """
    Manager personalizado para el modelo de Usuario.
    Define la lógica de creación de usuarios normales y superusuarios.
    """

    def _create_user(
        self,
        username,
        email,
        name,
        last_name,
        role,
        password,
        is_staff,
        is_superuser,
        **extra_fields,
    ):
        user = self.model(
            username=username,
            email=self.normalize_email(email),
            name=name,
            last_name=last_name,
            role=role,
            is_staff=is_staff,
            is_superuser=is_superuser,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(
        self, username, email, name, last_name, password=None, role=None, **extra_fields
    ):
        """
        Crea un usuario normal. Por defecto, el rol es CAJA.
        """
        role = role or User.Roles.CAJA
        return self._create_user(
            username,
            email,
            name,
            last_name,
            role,
            password,
            False,
            False,
            **extra_fields,
        )

    def create_superuser(
        self, username, email, name, last_name, password=None, role=None, **extra_fields
    ):
        """
        Crea un superusuario. Por defecto, el rol es ADMIN.
        """
        role = role or User.Roles.ADMIN
        return self._create_user(
            username, email, name, last_name, role, password, True, True, **extra_fields
        )


class User(AbstractBaseUser, PermissionsMixin):
    """
    Modelo de Usuario personalizado que sustituye al de Django por defecto.
    """

    class Roles(models.TextChoices):
        CAJA = "CAJA", "Cajero"
        COCINA = "COCINA", "Cocinero"
        ADMIN = "ADMIN", "Administrador"

    username = models.CharField("Nombre de usuario", max_length=255, unique=True)
    email = models.EmailField("Correo Electrónico", max_length=255, unique=True)
    name = models.CharField("Nombres", max_length=255)
    last_name = models.CharField("Apellidos", max_length=255)
    role = models.CharField(
        "Rol", max_length=10, choices=Roles.choices, default=Roles.CAJA
    )

    # Estados del usuario
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Manager personalizado
    objects = UserManager()

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "name", "last_name"]

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"

    def __str__(self):
        return f"{self.name} {self.last_name}"
