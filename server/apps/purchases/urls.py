from rest_framework.routers import DefaultRouter

from .views import SupplierViewSet

from .views import PurchaseViewSet

router = DefaultRouter()
router.register(r"suppliers", SupplierViewSet, basename="suppliers")

router.register(r"", PurchaseViewSet, basename="purchases")


urlpatterns = router.urls
