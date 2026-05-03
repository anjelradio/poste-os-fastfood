from rest_framework import serializers

from apps.inventory.models import MeasureUnit, RawMaterial


class MeasureUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeasureUnit
        fields = ("id", "name", "code")


class RawMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = RawMaterial
        fields = ("id", "name")
