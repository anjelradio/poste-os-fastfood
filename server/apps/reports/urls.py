from rest_framework.routers import DefaultRouter
from django.urls import path

from apps.reports.views import (
    ClientViewSet,
    LogBookViewSet,
    ReportView,
)

router = DefaultRouter()
router.register(r"logbook", LogBookViewSet, basename="LogBook")
router.register(r"clients", ClientViewSet, basename="Clients")

urlpatterns = [
    path(
        "purchases/pdf/",
        ReportView.as_view(),
        {"report_type": "purchases", "report_format": "pdf"},
        name="purchase-report-pdf",
    ),
    path(
        "purchases/<str:report_format>/",
        ReportView.as_view(),
        {"report_type": "purchases"},
        name="purchase-report-by-format",
    ),
    path(
        "profits/pdf/",
        ReportView.as_view(),
        {"report_type": "profits", "report_format": "pdf"},
        name="profit-report-pdf",
    ),
    path(
        "profits/<str:report_format>/",
        ReportView.as_view(),
        {"report_type": "profits"},
        name="profit-report-by-format",
    ),
    path(
        "product-sales/pdf/",
        ReportView.as_view(),
        {"report_type": "product-sales", "report_format": "pdf"},
        name="product-sales-report-pdf",
    ),
    path(
        "product-sales/<str:report_format>/",
        ReportView.as_view(),
        {"report_type": "product-sales"},
        name="product-sales-report-by-format",
    ),
] + router.urls
