from rest_framework.routers import DefaultRouter
from django.urls import path

from apps.reports.views import LogBookViewSet, PurchaseReportPDFView

router = DefaultRouter()
router.register(r"logbook", LogBookViewSet, basename="LogBook")

urlpatterns = [
    path("purchases/pdf/", PurchaseReportPDFView.as_view(), name="purchase-report-pdf"),
    path(
        "purchases/<str:report_format>/",
        PurchaseReportPDFView.as_view(),
        name="purchase-report-by-format",
    ),
] + router.urls
