from django.urls import path

from .views import MeasureUnitListAPIView, RawMaterialListAPIView

urlpatterns = [
    path("measure-units/", MeasureUnitListAPIView.as_view(), name="measure_units_list"),
    path("raw-materials/", RawMaterialListAPIView.as_view(), name="raw_materials_list"),
]
