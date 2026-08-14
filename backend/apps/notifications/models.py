import uuid

from django.conf import settings
from django.db import models


class DeviceToken(models.Model):
    """Push notification token for a user's device (Expo push token)."""

    PLATFORM_CHOICES = [
        ("ios", "iOS"),
        ("android", "Android"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="device_tokens"
    )
    token = models.CharField(max_length=255, unique=True)
    platform = models.CharField(max_length=10, choices=PLATFORM_CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "device_tokens"

    def __str__(self):
        return f"{self.user} - {self.platform}"


class Notification(models.Model):
    """A notification sent (or scheduled to be sent) to a user."""

    CATEGORY_CHOICES = [
        ("verse_of_day", "Mstari wa Leo"),
        ("devotion", "Neno la Leo"),
        ("reminder", "Reminder"),
        ("system", "System"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True,
        help_text="Null = broadcast to all users",
    )
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="system")
    title_sw = models.CharField(max_length=150)
    title_en = models.CharField(max_length=150, blank=True)
    body_sw = models.TextField()
    body_en = models.TextField(blank=True)
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title_sw
