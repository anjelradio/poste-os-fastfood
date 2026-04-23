from django.urls import path

from .views import (
    ChangeEmailConfirmView,
    ChangeEmailRequestOtpView,
    ChangeEmailVerifyOtpView,
    ChangePasswordView,
    ForgotPasswordRequestOtpView,
    ForgotPasswordVerifyOtpView,
    LoginView,
    LogoutView,
    UpdateInfoView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path(
        "forgot-password/request-otp/",
        ForgotPasswordRequestOtpView.as_view(),
        name="forgot-password-request-otp",
    ),
    path(
        "forgot-password/verify-otp/",
        ForgotPasswordVerifyOtpView.as_view(),
        name="forgot-password-verify-otp",
    ),
    path(
        "change-email/request-otp/",
        ChangeEmailRequestOtpView.as_view(),
        name="change-email-request-otp",
    ),
    path(
        "change-email/verify-otp/",
        ChangeEmailVerifyOtpView.as_view(),
        name="change-email-verify-otp",
    ),
    path(
        "change-email/confirm/",
        ChangeEmailConfirmView.as_view(),
        name="change-email-confirm",
    ),
    path("update-info/", UpdateInfoView.as_view(), name="update-info"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
]
