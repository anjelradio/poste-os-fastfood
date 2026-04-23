from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.utils.text import slugify
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.authentication.permissions import IsAdmin, IsAdminOrCaja
from apps.base.mixins import ErrorResponseMixin
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

    def list(self, request):
        queryset = self.get_queryset()

        product_name = request.query_params.get("productName", "")
        category = request.query_params.get("category", "")

        if product_name:
            queryset = queryset.filter(name__icontains=product_name)

        if category:
            queryset = queryset.filter(category__name__icontains=category)

        total = queryset.count()

        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("pageSize", 8))
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
