from rest_framework.routers import DefaultRouter
from django.urls import path

from apps.reports.views import (
    LogBookViewSet,
    ReportView,
)

router = DefaultRouter()
router.register(r"logbook", LogBookViewSet, basename="LogBook")

urlpatterns = [
    path(
        "purchases/pdf/",
        ReportView.as_view(),
        {"report_type": "purchases", "report_format": "pdf"},
        name="purchase-report-pdf",
    ),
    path(
        "purchases/summary/",
        ReportView.as_view(),
        {"report_type": "purchases", "report_format": "summary"},
        name="purchase-report-summary",
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
        "profits/summary/",
        ReportView.as_view(),
        {"report_type": "profits", "report_format": "summary"},
        name="profit-report-summary",
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
        "product-sales/summary/",
        ReportView.as_view(),
        {"report_type": "product-sales", "report_format": "summary"},
        name="product-sales-report-summary",
    ),
    path(
        "product-sales/<str:report_format>/",
        ReportView.as_view(),
        {"report_type": "product-sales"},
        name="product-sales-report-by-format",
    ),
] + router.urls
