from rest_framework.routers import DefaultRouter

from apps.purchases.views import SupplierViewSet

router = DefaultRouter()
router.register(r"suppliers", SupplierViewSet, basename="suppliers")

urlpatterns = router.urls
