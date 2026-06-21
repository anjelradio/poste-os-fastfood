from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    MeasureUnitListAPIView,
    RawMaterialViewSet,
    InventoryMovementListAPIView,
)

router = DefaultRouter()
router.register(r"raw-materials", RawMaterialViewSet, basename="raw-materials")

urlpatterns = [
    path("measure-units/", MeasureUnitListAPIView.as_view(), name="measure_units_list"),
    path("movements/", InventoryMovementListAPIView.as_view(), name="inventory_movements_list"),
]

urlpatterns += router.urls

