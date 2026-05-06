from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.response import Response

from apps.authentication.permissions import IsAdmin
from apps.purchases.models import Supplier
from apps.purchases.serializers import SupplierSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = SupplierSerializer
    queryset = Supplier.objects.filter(state=True).order_by("id")

    def destroy(self, request, *args, **kwargs):
        supplier = self.get_object()
        supplier.state = False
        supplier.deleted_date = timezone.localdate()
        supplier.save()
        return Response(status=status.HTTP_200_OK)
