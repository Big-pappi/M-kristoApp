from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from . import views

app_name = "accounts"

urlpatterns = [
    path("register/", views.RegisterView.as_view(), name="register"),
    path("otp/request/", views.RequestOTPView.as_view(), name="otp-request"),
    path("otp/verify/", views.VerifyOTPView.as_view(), name="otp-verify"),
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("me/", views.MeView.as_view(), name="me"),
]
