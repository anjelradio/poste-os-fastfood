from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.authentication.permissions import IsAdminOrCaja, IsAdminOrCajaOrCocina
from apps.base.mixins import ErrorResponseMixin
from apps.orders.models import Order
from apps.orders.serializers import (
    OrderListSerializer,
    OrderSerializer,
)
from apps.reports.models import Logbook
from apps.reports.services import create_logbook


class OrderViewSet(ErrorResponseMixin, GenericViewSet):
    permission_classes = [IsAdminOrCaja]
    serializer_class = OrderSerializer
    list_serializer_class = OrderListSerializer

    def get_permissions(self):
        if self.action == "list":
            return [IsAdminOrCajaOrCocina()]
        return super().get_permissions()

    def get_queryset(self):
        if self.queryset is None:
            self.queryset = Order.objects.filter(state=True)
        return self.queryset

    def list(self, request):
        queryset = self.get_queryset()

        date = request.query_params.get("date")
        order_status = request.query_params.get("status")
        order_type = request.query_params.get("type")

        if date:
            queryset = queryset.filter(created_date=date)

        if order_status == "NOT_READY":
            queryset = queryset.exclude(status="READY")
        elif order_status and order_status != "ALL":
            queryset = queryset.filter(status=order_status)

        if order_type and order_type != "ALL":
            type_aliases = {
                "MESA": "DINE_IN",
                "LLEVAR": "TAKEAWAY",
            }
            order_type = type_aliases.get(order_type, order_type)
            queryset = queryset.filter(type=order_type)

        queryset = queryset.order_by("order_number")

        orders_serializer = self.list_serializer_class(queryset, many=True)
        return Response(orders_serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        order_serializer = self.serializer_class(data=request.data)
        if order_serializer.is_valid():
            order = order_serializer.save()
            create_logbook(
                request,
                Logbook.ActionChoices.CREATE,
                f"Orden nro {order.order_number} creada",
            )
            return Response(status=status.HTTP_201_CREATED)

        return self.error_response(order_serializer.errors)

    @action(detail=True, methods=["post"])
    def change_status(self, request, pk=None):
        order = get_object_or_404(Order, pk=pk, state=True)
        old_status = order.status

        if order.status == "PENDING":
            order.status = "PREPARING"
        elif order.status == "PREPARING":
            order.status = "READY"
            order.ready_at = timezone.now()

        order.save()

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Orden nro {order.order_number} cambio de {old_status} a {order.status}",
        )

        return Response(status=status.HTTP_200_OK)
