from rest_framework import serializers

from apps.orders.models import OrderProducts


class OrderProductsSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderProducts
        fields = ("product",)
