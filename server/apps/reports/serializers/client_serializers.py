from rest_framework import serializers

from apps.orders.models import Client


class ClientListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ("id", "name", "nit", "created_date")
