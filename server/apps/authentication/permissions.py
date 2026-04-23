from rest_framework import permissions

from apps.users.models import User


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Roles.ADMIN


class IsCaja(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Roles.CAJA


class IsCocina(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Roles.COCINA


class IsAdminOrCaja(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            User.Roles.ADMIN,
            User.Roles.CAJA,
        ]


class IsAdminOrCocina(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            User.Roles.ADMIN,
            User.Roles.COCINA,
        ]


class IsAdminOrCajaOrCocina(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in [
            User.Roles.ADMIN,
            User.Roles.CAJA,
            User.Roles.COCINA,
        ]
