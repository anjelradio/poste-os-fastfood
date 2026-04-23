from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryListAPIView,
    ProductViewSet,
)

router = DefaultRouter()
router.register(r"", ProductViewSet, basename="Productos")

urlpatterns = [
    path("categories/", CategoryListAPIView.as_view(), name="categories_list")
]

urlpatterns += router.urls
