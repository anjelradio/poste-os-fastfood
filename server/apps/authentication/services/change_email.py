import secrets

from django.conf import settings
from django.core.cache import cache

from apps.authentication.services.brevo_email import BrevoEmailService


class ChangeEmailService:
    def __init__(self, user):
        self.user = user
        self.email_service = BrevoEmailService()

    @property
    def _otp_key(self) -> str:
        return f"auth:change-email:otp:{self.user.id}"

    @property
    def _verification_token_key(self) -> str:
        return f"auth:change-email:verification-token:{self.user.id}"

    @property
    def _otp_length(self) -> int:
        return int(getattr(settings, "CHANGE_EMAIL_OTP_LENGTH", 6))

    @property
    def _otp_ttl_seconds(self) -> int:
        return int(getattr(settings, "CHANGE_EMAIL_OTP_TTL_SECONDS", 300))

    @property
    def _verification_token_ttl_seconds(self) -> int:
        return int(getattr(settings, "CHANGE_EMAIL_VERIFICATION_TOKEN_TTL_SECONDS", 600))

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

    def create_and_store_verification_token(self) -> str:
        token = secrets.token_urlsafe(32)
        cache.set(
            self._verification_token_key,
            token,
            timeout=self._verification_token_ttl_seconds,
        )
        return token

    def verify_verification_token(self, token: str) -> bool:
        cached_token = cache.get(self._verification_token_key)
        if not cached_token:
            return False

        return secrets.compare_digest(str(cached_token), str(token))

    def clear_verification_token(self):
        cache.delete(self._verification_token_key)

    def send_change_email_otp_email(self, otp: str):
        subject = "Código OTP para cambiar tu correo electrónico"
        text_content = (
            f"Tu código OTP es: {otp}. "
            f"Este código vence en {self._otp_ttl_seconds // 60} minutos."
        )
        html_content = (
            "<p>Hola,</p>"
            "<p>Solicitaste cambiar el correo electrónico de tu cuenta.</p>"
            f"<p><strong>Tu código OTP es: {otp}</strong></p>"
            f"<p>Este código vence en {self._otp_ttl_seconds // 60} minutos.</p>"
            "<p>Si no solicitaste este cambio, ignora este correo.</p>"
        )

        self.email_service.send_email(
            to_email=self.user.email,
            subject=subject,
            text_content=text_content,
            html_content=html_content,
        )
