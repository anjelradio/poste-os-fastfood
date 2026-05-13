from rest_framework import serializers

from apps.purchases.models import Supplier


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = (
            "id",
            "business_name",
            "contact_name",
            "phone",
            "email",
        )


class SupplierListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = (
            "id",
            "business_name",
            "contact_name",
            "phone",
            "email",
        )