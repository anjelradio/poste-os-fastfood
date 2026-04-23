from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.authentication.permissions import IsAdmin
from apps.base.mixins import ErrorResponseMixin
from apps.reports.models import Logbook
from apps.reports.services import create_logbook
from apps.users.models import User
from apps.users.serializers import CreateUserSerializer, UpdateUserSerializer, UserSerializer


class UserViewSet(ErrorResponseMixin, ModelViewSet):
    permission_classes = [IsAdmin]
    serializer_class = CreateUserSerializer

    def get_queryset(self, pk=None):
        queryset = User.objects.filter(is_active=True).order_by("id")

        if pk is None:
            return queryset

        return queryset.filter(id=pk).first()

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return UserSerializer

        if self.action == "update":
            return UpdateUserSerializer

        return CreateUserSerializer

    def list(self, request):
        users = self.get_queryset()

        username = request.query_params.get("username", "")
        role = request.query_params.get("role", "")

        if username:
            users = users.filter(username__icontains=username)

        if role:
            users = users.filter(role=role)

        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        user = serializer.save()
        create_logbook(
            request,
            Logbook.ActionChoices.CREATE,
            f"Usuario '{user.username}' creado",
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        user = self.get_queryset(pk)

        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(user, data=request.data)

        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        updated_user = serializer.save()
        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Usuario '{updated_user.username}' actualizado",
        )
        return Response(UserSerializer(updated_user).data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None):
        user = self.get_queryset(pk)

        if not user:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user.is_active = False
        user.save()
        create_logbook(
            request,
            Logbook.ActionChoices.DELETE,
            f"Usuario '{user.username}' desactivado",
        )
        return Response(status=status.HTTP_200_OK)
