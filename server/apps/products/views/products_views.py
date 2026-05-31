from datetime import date, datetime
from decimal import Decimal

from django.shortcuts import get_object_or_404
from django.db.models import Count, DecimalField, Sum, Value
from django.db.models.functions import Coalesce
from django.utils import timezone
from django.utils.text import slugify
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.authentication.permissions import (
    IsAdmin,
    IsAdminOrCaja,
    IsAdminOrCajaOrCocina,
)
from apps.base.mixins import ErrorResponseMixin
from apps.orders.models import OrderProducts
from apps.products.models import Category
from apps.products.serializers import (
    ProductListSerializer,
    ProductSerializer,
)
from apps.reports.models import Logbook
from apps.reports.services import create_logbook


class ProductViewSet(ErrorResponseMixin, ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = ProductSerializer
    list_serializer_class = ProductListSerializer

    def get_permissions(self):
        if self.action == "list_by_category":
            return [IsAdminOrCaja()]
        if self.action == "list":
            return [IsAdminOrCajaOrCocina()]
        return [IsAdmin()]

    def get_serializer_class(self):
        if self.action in ("list", "retrieve", "list_by_category"):
            return self.list_serializer_class
        return self.serializer_class

    def get_queryset(self, pk=None):
        queryset = (
            self.get_serializer()
            .Meta.model.objects.filter(state=True)
            .select_related("category")
        )

        if pk is None:
            return queryset
        return queryset.filter(id=pk).first()

    def get_category(self, slug):
        return get_object_or_404(Category, slug=slug)

    def generate_slug(self, name):
        return slugify(name or "")

    def parse_bool_query_param(self, value):
        if value is None:
            return None

        normalized = value.strip().lower()
        if normalized in ("true", "1", "yes", "si", "sí"):
            return True
        if normalized in ("false", "0", "no"):
            return False

        return None

    def _parse_date_query_param(self, value):
        if not value:
            return None

        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError:
            return None

    def _build_top_sold_queryset(self, from_date: date, to_date: date):
        return (
            OrderProducts.objects.filter(
                state=True,
                order__state=True,
                product__state=True,
                order__created_date__range=[from_date, to_date],
            )
            .exclude(order__status="CANCELLED")
            .values("product_id", "product__name", "product__image")
            .annotate(
                quantity_sold=Coalesce(Sum("quantity"), 0),
                orders_count=Count("order_id", distinct=True),
                revenue=Coalesce(
                    Sum("subtotal"),
                    Value(Decimal("0.00"), output_field=DecimalField(max_digits=12, decimal_places=2)),
                ),
            )
            .order_by("-quantity_sold", "-revenue", "product_id")
        )

    def _serialize_top_sold_item(self, row):
        return {
            "productId": row["product_id"],
            "name": row["product__name"],
            "image": row["product__image"],
            "quantitySold": row["quantity_sold"],
            "ordersCount": row["orders_count"],
            "revenue": row["revenue"],
        }

    def list(self, request):
        queryset = self.get_queryset()

        product_name = request.query_params.get("product_name", "")
        category = request.query_params.get("category", "")
        slug = request.query_params.get("slug", "")
        has_recipe = self.parse_bool_query_param(request.query_params.get("has_recipe"))

        if product_name:
            queryset = queryset.filter(name__icontains=product_name)

        if category:
            queryset = queryset.filter(category__name__icontains=category)

        if slug:
            queryset = queryset.filter(slug=slug)

        if has_recipe is not None:
            queryset = queryset.filter(has_recipe=has_recipe)

        total = queryset.count()

        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("page_size", 8))
        skip = (page - 1) * page_size

        products = queryset[skip : skip + page_size]
        products_serializer = self.list_serializer_class(products, many=True)
        return Response(
            {
                "products": products_serializer.data,
                "total": total,
            },
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["GET"],
        url_path=r"category/(?P<category_slug>[-a-zA-Z0-9_]+)",
    )
    def list_by_category(self, request, category_slug=None):
        category = self.get_category(category_slug)
        products = self.get_queryset().filter(category=category)
        products_serializer = self.get_serializer(products, many=True)
        return Response(products_serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"], url_path="top-sold")
    def top_sold(self, request):
        mode = request.query_params.get("mode", "summary")
        if mode not in ("summary", "list"):
            return self.error_response(
                {"mode": "El modo debe ser 'summary' o 'list'"},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if mode == "summary":
            today = timezone.localdate()
            from_date = date(today.year, 1, 1)
            to_date = today
        else:
            from_date_raw = request.query_params.get("from_date")
            to_date_raw = request.query_params.get("to_date")

            if not from_date_raw or not to_date_raw:
                return self.error_response(
                    {"date": "Los parámetros from_date y to_date son obligatorios"},
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            from_date = self._parse_date_query_param(from_date_raw)
            to_date = self._parse_date_query_param(to_date_raw)

            if from_date is None or to_date is None:
                return self.error_response(
                    {"date": "Formato de fecha inválido. Use YYYY-MM-DD"},
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

            if from_date > to_date:
                return self.error_response(
                    {"date": "from_date no puede ser mayor que to_date"},
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

        queryset = self._build_top_sold_queryset(from_date, to_date)

        if mode == "summary":
            top_item = queryset.first()
            item = self._serialize_top_sold_item(top_item) if top_item else None
            return Response(
                {
                    "item": item,
                    "from_date": from_date,
                    "to_date": to_date,
                },
                status=status.HTTP_200_OK,
            )

        items = [self._serialize_top_sold_item(row) for row in queryset]
        return Response(
            {
                "items": items,
                "total": len(items),
                "from_date": from_date,
                "to_date": to_date,
            },
            status=status.HTTP_200_OK,
        )

    def create(self, request):
        data = request.data.copy()
        slug = self.generate_slug(data.get("name"))
        data["slug"] = slug

        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            product = serializer.save()
            create_logbook(
                request,
                Logbook.ActionChoices.CREATE,
                f"Producto '{product.name}' creado",
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return self.error_response(serializer.errors)

    def update(self, request, pk=None):
        instance = self.get_queryset(pk)
        if not instance:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()

        if "name" in data:
            slug = self.generate_slug(data["name"])
            data["slug"] = slug

        serializer = self.serializer_class(instance, data=data)
        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        serializer.save()

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Producto '{instance.name}' actualizado",
        )

        return Response(serializer.data)

    def destroy(self, request, pk=None):
        product = self.get_queryset(pk)
        if product:
            product_name = product.name
            product.state = False
            product.deleted_date = timezone.localdate()
            product.save()
            create_logbook(
                request,
                Logbook.ActionChoices.DELETE,
                f"Producto '{product_name}' eliminado",
            )
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
