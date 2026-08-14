import random
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import OTPVerification
from .serializers import (
    RegisterSerializer,
    RequestOTPSerializer,
    UserSerializer,
    VerifyOTPSerializer,
)

User = get_user_model()

OTP_LIFETIME_MINUTES = 5


def _tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


class RegisterView(generics.CreateAPIView):
    """
    POST /api/v1/auth/register/
    Creates the account (unverified) and immediately fires an OTP so the
    app can move straight into the verify-phone screen.
    """

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        code = f"{random.randint(0, 999999):06d}"
        OTPVerification.objects.create(
            user=user,
            phone_number=user.phone_number,
            code=code,
            purpose="signup",
            expires_at=timezone.now() + timedelta(minutes=OTP_LIFETIME_MINUTES),
        )
        # TODO: integrate SMS gateway (e.g. Beem Africa / Africa's Talking) to
        # actually send `code` to user.phone_number. Logged for dev only.
        print(f"[DEV OTP] {user.phone_number} -> {code}")

        return Response(
            {"detail": "Usajili umefanikiwa. Tumetuma msimbo wa uthibitisho."},
            status=status.HTTP_201_CREATED,
        )


class RequestOTPView(APIView):
    """POST /api/v1/auth/otp/request/ — (re)send a code for login or reset."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RequestOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data["phone_number"]
        purpose = serializer.validated_data["purpose"]

        user = User.objects.filter(phone_number=phone_number).first()
        if purpose in ("login", "reset_password") and not user:
            return Response(
                {"detail": "Namba ya simu haijasajiliwa."},
                status=status.HTTP_404_NOT_FOUND,
            )

        code = f"{random.randint(0, 999999):06d}"
        OTPVerification.objects.create(
            user=user,
            phone_number=phone_number,
            code=code,
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=OTP_LIFETIME_MINUTES),
        )
        print(f"[DEV OTP] {phone_number} -> {code}")

        return Response({"detail": "Msimbo umetumwa."}, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    """
    POST /api/v1/auth/otp/verify/
    Verifies the code and, on success, returns JWT tokens (login) or marks
    the phone verified (signup) or a short-lived reset ticket (reset_password).
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data["phone_number"]
        code = serializer.validated_data["code"]
        purpose = serializer.validated_data["purpose"]

        otp = (
            OTPVerification.objects.filter(
                phone_number=phone_number, code=code, purpose=purpose, is_used=False
            )
            .order_by("-created_at")
            .first()
        )

        if not otp or otp.expires_at < timezone.now():
            return Response(
                {"detail": "Msimbo si sahihi au umeisha muda wake."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        otp.is_used = True
        otp.save(update_fields=["is_used"])

        user = otp.user or User.objects.filter(phone_number=phone_number).first()
        if not user:
            return Response({"detail": "Mtumiaji hajapatikana."}, status=status.HTTP_404_NOT_FOUND)

        if purpose == "signup":
            user.is_phone_verified = True
            user.save(update_fields=["is_phone_verified"])

        user.last_login_at = timezone.now()
        user.save(update_fields=["last_login_at"])

        tokens = _tokens_for_user(user)
        return Response(
            {**tokens, "user": UserSerializer(user).data},
            status=status.HTTP_200_OK,
        )


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/v1/auth/me/ — current user's profile & preferences."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
