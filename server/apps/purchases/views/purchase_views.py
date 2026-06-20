from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.authentication.permissions import IsAdmin
from apps.base.mixins import ErrorResponseMixin
from apps.purchases.models import Purchase
from apps.purchases.serializers import (
    PurchaseDetailSerializer,
    PurchaseListSerializer,
    PurchaseSerializer,
)
from apps.reports.models import Logbook
from apps.reports.services import create_logbook


class PurchaseViewSet(ErrorResponseMixin, GenericViewSet):
    permission_classes = [IsAdmin]
    serializer_class = PurchaseSerializer
    list_serializer_class = PurchaseListSerializer
    detail_serializer_class = PurchaseDetailSerializer

    def get_queryset(self):
        if self.queryset is None:
            self.queryset = Purchase.objects.filter(state=True).select_related(
                "supplier"
            ).prefetch_related(
                "items", "items__raw_material", "items__raw_material__measure_unit"
            )
        return self.queryset

    def list(self, request):
        queryset = self.get_queryset()

        date = request.query_params.get("date")
        if date:
            queryset = queryset.filter(purchased_at__date=date)

        queryset = queryset.order_by("-purchased_at")
        total = queryset.count()

        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("page_size", 8))
        skip = (page - 1) * page_size

        purchases = queryset[skip : skip + page_size]
        serializer = self.list_serializer_class(purchases, many=True)

        return Response(
            {
                "purchases": serializer.data,
                "total": total,
            },
            status=status.HTTP_200_OK,
        )

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        purchase = serializer.create(serializer.validated_data)

        create_logbook(
            request,
            Logbook.ActionChoices.CREATE,
            f"Compra #{purchase.id} creada",
        )

        return Response(status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        purchase = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.detail_serializer_class(purchase)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk=None):
        purchase = get_object_or_404(self.get_queryset(), pk=pk)
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        serializer.update(purchase, serializer.validated_data)

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Compra #{purchase.id} actualizada",
        )

        return Response(status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        purchase = self.get_queryset().filter(pk=pk).first()
        if purchase is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        purchase.state = False
        purchase.deleted_date = timezone.localdate()
        purchase.save(update_fields=["state", "deleted_date"])

        create_logbook(
            request,
            Logbook.ActionChoices.DELETE,
            f"Compra #{purchase.id} eliminada",
        )

        return Response(status=status.HTTP_200_OK)
