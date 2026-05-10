from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.authentication.permissions import IsCocina
from apps.base.mixins import ErrorResponseMixin
from apps.products.models import Product, Recipe
from apps.products.serializers import RecipeItemListSerializer, RecipeSerializer
from apps.reports.models import Logbook
from apps.reports.services import create_logbook


class RecipeViewSet(ErrorResponseMixin, GenericViewSet):
    permission_classes = [IsCocina]
    serializer_class = RecipeSerializer
    list_serializer_class = RecipeItemListSerializer

    def get_product(self, product_id):
        return get_object_or_404(Product.objects.filter(state=True), pk=product_id)

    def retrieve(self, request, product_id=None):
        product = self.get_product(product_id)
        recipes = Recipe.objects.filter(product=product).select_related(
            "raw_material", "measure_unit"
        )
        serializer = self.list_serializer_class(recipes, many=True)
        return Response({"items": serializer.data}, status=status.HTTP_200_OK)

    def update(self, request, product_id=None):
        product = self.get_product(product_id)
        had_recipe = Recipe.objects.filter(product=product).exists()

        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        recipes = serializer.upsert(product=product)
        output = self.list_serializer_class(recipes, many=True)

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE if had_recipe else Logbook.ActionChoices.CREATE,
            f"Receta de producto '{product.name}' {'actualizada' if had_recipe else 'creada'}",
        )

        return Response({"items": output.data}, status=status.HTTP_200_OK)

    def destroy(self, request, product_id=None):
        product = self.get_product(product_id)
        Recipe.objects.filter(product=product).delete()

        create_logbook(
            request,
            Logbook.ActionChoices.DELETE,
            f"Receta de producto '{product.name}' eliminada",
        )

        return Response(status=status.HTTP_200_OK)
