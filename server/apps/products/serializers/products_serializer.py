from rest_framework import serializers

from apps.products.models import Category, Product
from apps.products.serializers import CategorySerializer


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.filter(state=True))

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "price",
            "image",
            "slug",
            "has_recipe",
            "category",
        )


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = ("id", "name", "price", "image", "slug", "has_recipe", "category")
