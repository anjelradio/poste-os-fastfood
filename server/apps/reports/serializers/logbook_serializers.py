from rest_framework import serializers

from apps.reports.models import Logbook


class LogBookListSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username")

    class Meta:
        model = Logbook
        fields = (
            "id",
            "created_date",
            "time",
            "area",
            "user",
            "action",
            "description",
            "ip_address",
        )
