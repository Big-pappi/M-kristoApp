from django.contrib import admin

from .models import DeviceToken, Notification


@admin.register(DeviceToken)
class DeviceTokenAdmin(admin.ModelAdmin):
    list_display = ["user", "platform", "is_active", "created_at"]
    list_filter = ["platform", "is_active"]


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["title_sw", "category", "user", "is_sent", "scheduled_for"]
    list_filter = ["category", "is_sent"]
