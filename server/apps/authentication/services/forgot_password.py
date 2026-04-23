import random
import secrets
import string

from django.conf import settings
from django.core.cache import cache
from rest_framework import serializers

from apps.authentication.services.brevo_email import BrevoEmailService
from apps.users.models import User
from apps.users.serializers.user_serializers import validate_password_policy


class ForgotPasswordService:
    def __init__(self, email: str):
        self.email = (email or "").strip().lower()
        self.email_service = BrevoEmailService()

    @property
    def _otp_key(self) -> str:
        return f"auth:forgot-password:otp:{self.email}"

    @property
    def _otp_length(self) -> int:
        return int(getattr(settings, "FORGOT_PASSWORD_OTP_LENGTH", 6))

    @property
    def _otp_ttl_seconds(self) -> int:
        return int(getattr(settings, "FORGOT_PASSWORD_OTP_TTL_SECONDS", 300))

    @property
    def _temporary_password_length(self) -> int:
        return int(getattr(settings, "FORGOT_PASSWORD_TEMP_PASSWORD_LENGTH", 8))

    def get_active_user(self):
        if not self.email:
            return None

        return User.objects.filter(email__iexact=self.email, is_active=True).first()

    def create_and_store_otp(self) -> str:
        upper_limit = 10**self._otp_length
        otp = str(secrets.randbelow(upper_limit)).zfill(self._otp_length)
        cache.set(self._otp_key, otp, timeout=self._otp_ttl_seconds)
        return otp

    def verify_otp(self, otp: str) -> bool:
        cached_otp = cache.get(self._otp_key)
        if not cached_otp:
            return False

        return secrets.compare_digest(str(cached_otp), str(otp))

    def clear_otp(self):
        cache.delete(self._otp_key)

    def generate_temporary_password(self) -> str:
        minimum_length = max(self._temporary_password_length, 6)
        alphabet = string.ascii_letters + string.digits

        for _ in range(10):
            required_chars = [
                secrets.choice(string.ascii_uppercase),
                secrets.choice(string.ascii_uppercase),
                secrets.choice(string.digits),
                secrets.choice(string.digits),
            ]
            remaining_chars = [
                secrets.choice(alphabet)
                for _ in range(max(0, minimum_length - len(required_chars)))
            ]
            password_chars = required_chars + remaining_chars
            random.SystemRandom().shuffle(password_chars)
            password = "".join(password_chars)

            try:
                validate_password_policy(password)
                return password
            except serializers.ValidationError:
                continue

        fallback_password = "AB12CD34"
        validate_password_policy(fallback_password)
        return fallback_password

    def send_otp_email(self, otp: str):
        subject = "Código OTP para restablecer tu contraseña"
        text_content = (
            f"Tu código OTP es: {otp}. "
            f"Este código vence en {self._otp_ttl_seconds // 60} minutos."
        )
        html_content = (
            "<p>Hola,</p>"
            "<p>Recibimos una solicitud para restablecer tu contraseña.</p>"
            f"<p><strong>Tu código OTP es: {otp}</strong></p>"
            f"<p>Este código vence en {self._otp_ttl_seconds // 60} minutos.</p>"
            "<p>Si no solicitaste este cambio, ignora este correo.</p>"
        )

        self.email_service.send_email(
            to_email=self.email,
            subject=subject,
            text_content=text_content,
            html_content=html_content,
        )

    def send_temporary_password_email(self, temporary_password: str):
        subject = "Tu nueva contraseña temporal"
        text_content = (
            f"Tu nueva contraseña temporal es: {temporary_password}. "
            "Por seguridad, cámbiala desde tu perfil después de iniciar sesión."
        )
        html_content = (
            "<p>Hola,</p>"
            "<p>Tu contraseña fue restablecida correctamente.</p>"
            f"<p><strong>Nueva contraseña temporal: {temporary_password}</strong></p>"
            "<p>Por seguridad, cámbiala desde tu perfil después de iniciar sesión.</p>"
        )

        self.email_service.send_email(
            to_email=self.email,
            subject=subject,
            text_content=text_content,
            html_content=html_content,
        )
