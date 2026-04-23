from rest_framework.routers import DefaultRouter

from apps.reports.views import LogBookViewSet

router = DefaultRouter()
router.register(r"logbook", LogBookViewSet, basename="LogBook")

urlpatterns = router.urls
