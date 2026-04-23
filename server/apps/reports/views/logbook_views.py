from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.authentication.permissions import IsAdmin
from apps.reports.models import Logbook
from apps.reports.serializers import LogBookListSerializer


class LogBookViewSet(GenericViewSet):
    permission_classes = [IsAdmin]
    serializer_class = LogBookListSerializer

    def get_queryset(self):
        return Logbook.objects.filter(state=True).select_related("user").order_by("-created_date", "-time")

    def list(self, request):
        queryset = self.get_queryset()

        date = request.query_params.get("date")
        area = request.query_params.get("area")

        if date:
            queryset = queryset.filter(created_date=date)

        if area:
            queryset = queryset.filter(area=area)

        total = queryset.count()

        page = int(request.query_params.get("page", 1))
        page_size = int(request.query_params.get("pageSize", 8))
        skip = (page - 1) * page_size

        logs = queryset[skip : skip + page_size]
        log_serializer = self.serializer_class(logs, many=True)

        return Response(
            {"data": log_serializer.data, "totalLogs": total},
            status=status.HTTP_200_OK,
        )
