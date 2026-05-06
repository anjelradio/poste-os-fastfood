from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import MeasureUnitListAPIView, RawMaterialViewSet

router = DefaultRouter()
router.register(r"raw-materials", RawMaterialViewSet, basename="raw-materials")

urlpatterns = [
    path("measure-units/", MeasureUnitListAPIView.as_view(), name="measure_units_list"),
]

urlpatterns += router.urls
