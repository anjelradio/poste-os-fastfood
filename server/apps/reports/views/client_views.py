from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from apps.authentication.permissions import IsAdmin
from apps.orders.models import Client
from apps.reports.serializers import ClientListSerializer


class ClientViewSet(GenericViewSet):
    permission_classes = [IsAdmin]
    serializer_class = ClientListSerializer

    def get_queryset(self):
        return Client.objects.filter(state=True).order_by("name")

    def list(self, request):
        clients = self.get_queryset()
        serializer = self.serializer_class(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        client = self.get_queryset().filter(pk=pk).first()
        if client is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(client)
        return Response(serializer.data, status=status.HTTP_200_OK)
