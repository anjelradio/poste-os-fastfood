from rest_framework import serializers

from apps.products.models import Category, Product
from apps.products.serializers import CategorySerializer


class ProductSerializer(serializers.ModelSerializer):
    hasRecipe = serializers.BooleanField(source="has_recipe", required=False)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.filter(state=True))

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "price",
            "image",
            "slug",
            "hasRecipe",
            "category",
        )


class ProductListSerializer(serializers.ModelSerializer):
    hasRecipe = serializers.BooleanField(source="has_recipe", read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ("id", "name", "price", "image", "slug", "hasRecipe", "category")
