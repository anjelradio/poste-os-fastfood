from django.utils import timezone

from apps.reports.models import Logbook


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("HTTP_X_REAL_IP") or request.META.get("REMOTE_ADDR")


def create_logbook(request, action, description, user=None):
    if user is None:
        user = request.user
        if not user.is_authenticated:
            return None

    role_to_area = {
        "CAJA": "CAJA",
        "COCINA": "COCINA",
        "ADMIN": "ADMINISTRATION",
    }

    return Logbook.objects.create(
        time=timezone.localtime().time(),
        action=action,
        description=description,
        ip_address=get_client_ip(request),
        user=user,
        area=role_to_area.get(user.role, "CAJA"),
    )
