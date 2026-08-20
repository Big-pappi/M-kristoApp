from rest_framework import serializers

from .models import DeviceToken, Notification


class DeviceTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceToken
        fields = ["id", "token", "platform", "is_active", "created_at"]
        read_only_fields = ["id", "created_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            "id",
            "category",
            "title_sw",
            "title_en",
            "body_sw",
            "body_en",
            "sent_at",
            "created_at",
        ]
