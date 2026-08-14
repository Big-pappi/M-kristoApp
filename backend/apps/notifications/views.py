from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DeviceToken, Notification
from .serializers import DeviceTokenSerializer, NotificationSerializer


class RegisterDeviceTokenView(APIView):
    """
    POST /api/v1/notifications/register-device/
    Body: {"token": "ExponentPushToken[...]", "platform": "android"}
    Called by the Expo app right after login/notification-permission grant.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = DeviceTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        DeviceToken.objects.update_or_create(
            token=serializer.validated_data["token"],
            defaults={
                "user": request.user,
                "platform": serializer.validated_data["platform"],
                "is_active": True,
            },
        )
        return Response({"detail": "Kifaa kimesajiliwa."}, status=status.HTTP_200_OK)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/notifications/ — current user's inbox (+ broadcasts)."""

    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            Q(user=self.request.user) | Q(user__isnull=True), is_sent=True
        )
