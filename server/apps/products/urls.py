from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryListAPIView,
    ProductViewSet,
    RecipeViewSet,
)

router = DefaultRouter()
router.register(r"", ProductViewSet, basename="Productos")

urlpatterns = [
    path("categories/", CategoryListAPIView.as_view(), name="categories_list"),
    path(
        "recipes/<int:product_id>/",
        RecipeViewSet.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}
        ),
        name="recipe_by_product",
    ),
]

urlpatterns += router.urls
