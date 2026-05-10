from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.authentication.permissions import IsAdmin, IsAdminOrCocina
from apps.base.mixins import ErrorResponseMixin
from apps.inventory.serializers import (
    MeasureUnitSerializer,
    RawMaterialListSerializer,
    RawMaterialSerializer,
)


class MeasureUnitListAPIView(ListAPIView):
    serializer_class = MeasureUnitSerializer

    def get_queryset(self):
        model = self.get_serializer().Meta.model
        return model.objects.filter(state=True)


class RawMaterialViewSet(ErrorResponseMixin, ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = RawMaterialSerializer
    list_serializer_class = RawMaterialListSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [IsAdminOrCocina()]

        return [IsAdmin()]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return self.list_serializer_class
        return self.serializer_class

    def get_queryset(self):
        model = self.serializer_class.Meta.model
        return model.objects.filter(state=True).select_related("measure_unit", "category")

    def destroy(self, request, pk=None):
        raw_material = self.get_queryset().filter(pk=pk).first()
        if raw_material is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        raw_material.state = False
        raw_material.deleted_date = timezone.localdate()
        raw_material.save()
        return Response(status=status.HTTP_200_OK)
