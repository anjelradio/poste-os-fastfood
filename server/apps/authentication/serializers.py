from rest_framework import serializers

from apps.users.serializers.user_serializers import validate_password_policy


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        error_messages={
            "required": "El nombre de usuario es requerido",
            "blank": "El nombre de usuario no puede estar vacío",
        }
    )
    password = serializers.CharField(
        write_only=True,
        error_messages={
            "required": "La contraseña es requerida",
            "blank": "La contraseña no puede estar vacía",
        },
    )

    def validate(self, data):
        from django.contrib.auth import authenticate

        self.auth_error_code = None

        user = authenticate(username=data["username"], password=data["password"])
        if not user:
            self.auth_error_code = "invalid_credentials"
            raise serializers.ValidationError("Credenciales inválidas")
        if not user.is_active:
            self.auth_error_code = "inactive_user"
            raise serializers.ValidationError("Usuario inactivo")
        data["user"] = user
        return data


class ForgotPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(
        error_messages={
            "required": "El correo electrónico es requerido",
            "blank": "El correo electrónico no puede estar vacío",
            "invalid": "El correo electrónico no es válido",
        }
    )


class ForgotPasswordVerifyOtpSerializer(serializers.Serializer):
    email = serializers.EmailField(
        error_messages={
            "required": "El correo electrónico es requerido",
            "blank": "El correo electrónico no puede estar vacío",
            "invalid": "El correo electrónico no es válido",
        }
    )
    otp = serializers.CharField(
        min_length=6,
        max_length=6,
        error_messages={
            "required": "El código OTP es requerido",
            "blank": "El código OTP no puede estar vacío",
            "min_length": "El código OTP debe tener 6 dígitos",
            "max_length": "El código OTP debe tener 6 dígitos",
        },
    )

    def validate_otp(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("El código OTP debe contener solo números")
        return value


class ChangeEmailVerifyOtpSerializer(serializers.Serializer):
    otp = serializers.CharField(
        min_length=6,
        max_length=6,
        error_messages={
            "required": "El código OTP es requerido",
            "blank": "El código OTP no puede estar vacío",
            "min_length": "El código OTP debe tener 6 dígitos",
            "max_length": "El código OTP debe tener 6 dígitos",
        },
    )

    def validate_otp(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("El código OTP debe contener solo números")
        return value


class ChangeEmailConfirmSerializer(serializers.Serializer):
    verification_token = serializers.CharField(
        error_messages={
            "required": "El token de verificación es requerido",
            "blank": "El token de verificación no puede estar vacío",
        }
    )
    new_email = serializers.EmailField(
        error_messages={
            "required": "El correo electrónico es requerido",
            "blank": "El correo electrónico no puede estar vacío",
            "invalid": "El correo electrónico no es válido",
        }
    )


class TokenResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only=True,
        error_messages={
            "required": "La contraseña actual es requerida",
            "blank": "La contraseña actual no puede estar vacía",
        },
    )
    new_password = serializers.CharField(
        write_only=True,
        error_messages={
            "required": "La nueva contraseña es requerida",
            "blank": "La nueva contraseña no puede estar vacía",
        },
    )
    confirm_password = serializers.CharField(
        write_only=True,
        error_messages={
            "required": "La confirmación de contraseña es requerida",
            "blank": "La confirmación de contraseña no puede estar vacía",
        },
    )

    def validate(self, attrs):
        request = self.context.get("request")
        user = request.user if request else None

        current_password = attrs.get("current_password")
        new_password = attrs.get("new_password")
        confirm_password = attrs.get("confirm_password")

        if not user or not user.check_password(current_password):
            raise serializers.ValidationError("La contraseña actual no es correcta")

        if current_password == new_password:
            raise serializers.ValidationError(
                "La nueva contraseña debe ser distinta a la actual"
            )

        if new_password != confirm_password:
            raise serializers.ValidationError(
                "La nueva contraseña y su confirmación no coinciden"
            )

        validate_password_policy(new_password)

        return attrs
