import json
from urllib import error, request

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured


class BrevoEmailService:
    def __init__(self):
        self.api_url = getattr(
            settings,
            "BREVO_API_URL",
            "https://api.brevo.com/v3/smtp/email",
        )
        self.api_key = getattr(settings, "BREVO_API_KEY", "")
        self.sender_email = getattr(settings, "BREVO_SENDER_EMAIL", "")
        self.sender_name = getattr(settings, "BREVO_SENDER_NAME", "Porteños FAST FOOD")

    def _validate_configuration(self):
        if not self.api_key:
            raise ImproperlyConfigured("Falta configurar BREVO_API_KEY")

        if not self.sender_email:
            raise ImproperlyConfigured("Falta configurar BREVO_SENDER_EMAIL")

    def send_email(
        self,
        *,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: str,
    ):
        self._validate_configuration()

        payload = {
            "sender": {"email": self.sender_email, "name": self.sender_name},
            "to": [{"email": to_email}],
            "subject": subject,
            "htmlContent": html_content,
            "textContent": text_content,
        }

        http_request = request.Request(
            self.api_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "accept": "application/json",
                "api-key": self.api_key,
                "content-type": "application/json",
            },
            method="POST",
        )

        try:
            with request.urlopen(http_request, timeout=10):
                return
        except error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="ignore")
            raise RuntimeError(f"Brevo respondió con error: {detail}") from exc
        except error.URLError as exc:
            raise RuntimeError("No fue posible conectar con Brevo") from exc
