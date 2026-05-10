from rest_framework import status
from django.core.exceptions import ImproperlyConfigured
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

from apps.authentication.serializers import (
    ChangeEmailConfirmSerializer,
    ChangeEmailVerifyOtpSerializer,
    ChangePasswordSerializer,
    ForgotPasswordRequestSerializer,
    ForgotPasswordVerifyOtpSerializer,
    LoginSerializer,
    TokenResponseSerializer,
)
from apps.authentication.services import (
    ChangeEmailService,
    ForgotPasswordService,
    LoginCooldownService,
)
from apps.base.mixins import ErrorResponseMixin
from apps.reports.models import Logbook
from apps.reports.services import create_logbook
from apps.users.serializers import (
    UpdateUserInfoSerializer,
    UserSerializer,
)
from apps.users.models import User


# Create your views here.
class LoginView(ErrorResponseMixin, APIView):
    @swagger_auto_schema(
        operation_summary="Login",
        operation_description="Autentica con username y password. Devuelve access y refresh token.",
        request_body=LoginSerializer,
        responses={
            200: openapi.Response(
                description="Login exitoso",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "tokens": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "access": openapi.Schema(type=openapi.TYPE_STRING),
                                "refresh": openapi.Schema(type=openapi.TYPE_STRING),
                            },
                        ),
                        "user": openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                "username": openapi.Schema(type=openapi.TYPE_STRING),
                                "email": openapi.Schema(type=openapi.TYPE_STRING),
                                "name": openapi.Schema(type=openapi.TYPE_STRING),
                                "last_name": openapi.Schema(type=openapi.TYPE_STRING),
                                "role": openapi.Schema(type=openapi.TYPE_STRING),
                            },
                        ),
                    },
                ),
            ),
            400: "Error de validacion",
            429: "Demasiados intentos fallidos. Usuario temporalmente bloqueado",
        },
        security=[],
    )
    def post(self, request):
        username = request.data.get("username", "")
        cooldown_service = LoginCooldownService(username=username)

        lock_seconds_remaining = cooldown_service.get_lock_seconds_remaining()
        if lock_seconds_remaining > 0:
            return Response(
                {
                    "errors": [
                        "Demasiados intentos fallidos. Intenta nuevamente en un minuto."
                    ],
                    "retry_after": lock_seconds_remaining,
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            is_invalid_credentials = (
                getattr(serializer, "auth_error_code", None) == "invalid_credentials"
            )
            if is_invalid_credentials:
                attempts = cooldown_service.register_failed_attempt()
                if attempts >= cooldown_service.max_failed_attempts:
                    return Response(
                        {
                            "errors": [
                                "Demasiados intentos fallidos. Intenta nuevamente en un minuto."
                            ],
                            "retry_after": cooldown_service.get_lock_seconds_remaining(),
                        },
                        status=status.HTTP_429_TOO_MANY_REQUESTS,
                    )

            return self.error_response(serializer.errors)

        user = serializer.validated_data["user"]
        cooldown_service.clear_attempts()
        refresh = RefreshToken.for_user(user)

        create_logbook(
            request,
            Logbook.ActionChoices.LOGIN,
            f"Usuario {user.username} inició sesión",
            user=user,
        )

        token_serializer = TokenResponseSerializer(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }
        )

        user_serializer = UserSerializer(user)

        return Response(
            {"tokens": token_serializer.data, "user": user_serializer.data},
            status=status.HTTP_200_OK,
        )


class UpdateInfoView(ErrorResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UpdateUserInfoSerializer(request.user, data=request.data)

        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        user = serializer.save()

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Usuario {user.username} actualizó su información de perfil",
            user=user,
        )

        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)


class ForgotPasswordRequestOtpView(ErrorResponseMixin, APIView):
    @swagger_auto_schema(
        operation_summary="Solicitar OTP de recuperación",
        operation_description="Recibe un correo, valida usuario activo y envía código OTP de 6 dígitos.",
        request_body=ForgotPasswordRequestSerializer,
        responses={
            200: "OTP enviado correctamente",
            400: "Error de validación o correo no encontrado",
            500: "Error al enviar correo",
        },
        security=[],
    )
    def post(self, request):
        serializer = ForgotPasswordRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        email = serializer.validated_data["email"]
        forgot_password_service = ForgotPasswordService(email=email)
        user = forgot_password_service.get_active_user()

        if not user:
            return self.error_response(
                {"email": ["No existe un usuario activo asociado a este correo."]}
            )

        otp = forgot_password_service.create_and_store_otp()

        try:
            forgot_password_service.send_otp_email(otp)
        except (ImproperlyConfigured, RuntimeError):
            return Response(
                {"errors": ["No se pudo enviar el correo de recuperación."]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Usuario {user.username} solicitó OTP para recuperación de contraseña",
            user=user,
        )

        return Response(
            {"message": "Código OTP enviado correctamente."},
            status=status.HTTP_200_OK,
        )


class ForgotPasswordVerifyOtpView(ErrorResponseMixin, APIView):
    @swagger_auto_schema(
        operation_summary="Verificar OTP y restablecer contraseña",
        operation_description="Verifica OTP, genera contraseña temporal, la guarda y la envía al correo.",
        request_body=ForgotPasswordVerifyOtpSerializer,
        responses={
            200: "Contraseña restablecida correctamente",
            400: "Error de validación o código inválido",
            500: "Error al enviar correo",
        },
        security=[],
    )
    def post(self, request):
        serializer = ForgotPasswordVerifyOtpSerializer(data=request.data)
        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]
        forgot_password_service = ForgotPasswordService(email=email)
        user = forgot_password_service.get_active_user()

        if not user:
            return self.error_response(
                {"email": ["No existe un usuario activo asociado a este correo."]}
            )

        if not forgot_password_service.verify_otp(otp):
            return self.error_response(
                {"otp": ["El código OTP es inválido o ha expirado."]}
            )

        temporary_password = forgot_password_service.generate_temporary_password()
        user.set_password(temporary_password)
        user.save()
        forgot_password_service.clear_otp()

        try:
            forgot_password_service.send_temporary_password_email(temporary_password)
        except (ImproperlyConfigured, RuntimeError):
            return Response(
                {
                    "errors": [
                        "La contraseña fue restablecida, pero no se pudo enviar el correo."
                    ]
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Usuario {user.username} restableció su contraseña mediante OTP",
            user=user,
        )

        return Response(
            {"message": "Contraseña restablecida correctamente. Revisa tu correo."},
            status=status.HTTP_200_OK,
        )


class ChangeEmailRequestOtpView(ErrorResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Solicitar OTP para cambio de correo",
        operation_description="Envía un código OTP al correo electrónico actual del usuario autenticado.",
        request_body=None,
        responses={
            200: "OTP enviado correctamente",
            500: "Error al enviar correo",
        },
    )
    def post(self, request):
        service = ChangeEmailService(request.user)
        otp = service.create_and_store_otp()

        try:
            service.send_change_email_otp_email(otp)
        except (ImproperlyConfigured, RuntimeError):
            return Response(
                {"errors": ["No se pudo enviar el código OTP al correo actual."]},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Usuario {request.user.username} solicitó OTP para cambio de correo electrónico",
            user=request.user,
        )

        return Response(
            {"message": "Código OTP enviado correctamente a tu correo actual."},
            status=status.HTTP_200_OK,
        )


class ChangeEmailVerifyOtpView(ErrorResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Verificar OTP para cambio de correo",
        operation_description="Valida el OTP recibido por correo y devuelve un token temporal para actualizar email.",
        request_body=ChangeEmailVerifyOtpSerializer,
        responses={
            200: "OTP verificado correctamente",
            400: "Código inválido o expirado",
        },
    )
    def post(self, request):
        serializer = ChangeEmailVerifyOtpSerializer(data=request.data)
        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        service = ChangeEmailService(request.user)
        otp = serializer.validated_data["otp"]

        if not service.verify_otp(otp):
            return self.error_response({"otp": ["El código OTP es inválido o ha expirado."]})

        service.clear_otp()
        verification_token = service.create_and_store_verification_token()

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Usuario {request.user.username} verificó OTP para cambio de correo electrónico",
            user=request.user,
        )

        return Response(
            {
                "message": "Código OTP verificado correctamente.",
                "verification_token": verification_token,
            },
            status=status.HTTP_200_OK,
        )


class ChangeEmailConfirmView(ErrorResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Confirmar cambio de correo",
        operation_description="Recibe token temporal y nuevo correo. Si es válido, actualiza el correo del usuario.",
        request_body=ChangeEmailConfirmSerializer,
        responses={
            200: "Correo actualizado correctamente",
            400: "Token inválido o correo no disponible",
        },
    )
    def post(self, request):
        serializer = ChangeEmailConfirmSerializer(data=request.data)
        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        service = ChangeEmailService(request.user)
        verification_token = serializer.validated_data["verification_token"]
        new_email = serializer.validated_data["new_email"]

        if not service.verify_verification_token(verification_token):
            return self.error_response(
                {"verification_token": ["El token de verificación es inválido o expiró."]}
            )

        if User.objects.filter(email__iexact=new_email).exclude(id=request.user.id).exists():
            return self.error_response(
                {"new_email": ["El correo electrónico ya está en uso."]}
            )

        request.user.email = new_email
        request.user.save(update_fields=["email"])
        service.clear_verification_token()

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Usuario {request.user.username} actualizó su correo electrónico",
            user=request.user,
        )

        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class LogoutView(ErrorResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="Logout",
        operation_description="Registra cierre de sesión en bitácora para el usuario autenticado.",
        request_body=None,
        responses={
            200: "Logout registrado correctamente",
        },
    )
    def post(self, request):
        create_logbook(
            request,
            Logbook.ActionChoices.LOGOUT,
            f"Usuario {request.user.username} cerró sesión",
            user=request.user,
        )

        return Response(
            {"message": "Logout registrado correctamente."},
            status=status.HTTP_200_OK,
        )


class ChangePasswordView(ErrorResponseMixin, APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})

        if not serializer.is_valid():
            return self.error_response(serializer.errors)

        user = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save()

        create_logbook(
            request,
            Logbook.ActionChoices.UPDATE,
            f"Usuario {user.username} actualizó su contraseña",
            user=user,
        )

        return Response(status=status.HTTP_200_OK)
