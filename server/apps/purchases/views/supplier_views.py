from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.authentication.permissions import IsAdmin
from apps.base.mixins import ErrorResponseMixin
from apps.purchases.serializers import SupplierListSerializer, SupplierSerializer


class SupplierViewSet(ErrorResponseMixin, ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = SupplierSerializer
    list_serializer_class = SupplierListSerializer

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return self.list_serializer_class
        return self.serializer_class

    def get_queryset(self):
        model = self.serializer_class.Meta.model
        return model.objects.filter(state=True).order_by("business_name")

    def list(self, request):
        suppliers = self.get_queryset()
        serializer = self.get_serializer(suppliers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        supplier = self.get_queryset().filter(pk=pk).first()
        if supplier is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(supplier)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return self.error_response(serializer.errors)

    def update(self, request, pk=None):
        supplier = self.get_queryset().filter(pk=pk).first()
        if supplier is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(supplier, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return self.error_response(serializer.errors)

    def destroy(self, request, pk=None):
        supplier = self.get_queryset().filter(pk=pk).first()
        if supplier is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        supplier.state = False
        supplier.deleted_date = timezone.localdate()
        supplier.save()
        return Response(status=status.HTTP_200_OK)
