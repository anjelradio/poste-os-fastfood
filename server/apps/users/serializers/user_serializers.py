from rest_framework import serializers

from apps.users.models import User


def validate_password_policy(value):
    if len(value) < 6:
        raise serializers.ValidationError(
            "La contraseña debe tener al menos 6 caracteres"
        )

    uppercase_count = sum(1 for char in value if char.isupper())
    digit_count = sum(1 for char in value if char.isdigit())

    if uppercase_count < 2:
        raise serializers.ValidationError(
            "La contraseña debe tener al menos 2 letras mayúsculas"
        )

    if digit_count < 2:
        raise serializers.ValidationError(
            "La contraseña debe tener al menos 2 números"
        )

    return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "name", "last_name", "role")


class UpdateUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "name", "last_name")
        error_messages = {
            "username": {
                "required": "El nombre de usuario es requerido",
                "blank": "El nombre de usuario no puede estar vacío",
            },
            "name": {
                "required": "El nombre es requerido",
                "blank": "El nombre no puede estar vacío",
            },
            "last_name": {
                "required": "El apellido es requerido",
                "blank": "El apellido no puede estar vacío",
            },
        }


class CreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "name", "last_name", "email", "password", "role")
        extra_kwargs = {
            "username": {
                "error_messages": {
                    "required": "El nombre de usuario es requerido",
                    "blank": "El nombre de usuario no puede estar vacío",
                    "unique": "El nombre de usuario ya está en uso",
                }
            },
            "name": {
                "error_messages": {
                    "required": "El nombre es requerido",
                    "blank": "El nombre no puede estar vacío",
                }
            },
            "last_name": {
                "error_messages": {
                    "required": "El apellido es requerido",
                    "blank": "El apellido no puede estar vacío",
                }
            },
            "email": {
                "error_messages": {
                    "required": "El correo electrónico es requerido",
                    "blank": "El correo electrónico no puede estar vacío",
                    "unique": "El correo electrónico ya está en uso",
                    "invalid": "El correo electrónico no es válido",
                }
            },
            "role": {
                "error_messages": {
                    "required": "El rol es requerido",
                    "blank": "El rol no puede estar vacío",
                    "invalid_choice": "El rol seleccionado no es válido",
                }
            },
        }

    def validate_password(self, value):
        return validate_password_policy(value)

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            name=validated_data["name"],
            last_name=validated_data["last_name"],
            password=validated_data["password"],
            role=validated_data["role"],
        )


class UpdateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ("username", "name", "last_name", "email", "password", "role")

    def validate_password(self, value):
        return validate_password_policy(value)

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance
