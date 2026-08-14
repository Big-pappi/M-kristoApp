from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import OTPVerification, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ["-created_at"]
    list_display = ["phone_number", "full_name", "email", "is_phone_verified", "is_staff"]
    search_fields = ["phone_number", "full_name", "email"]
    readonly_fields = ["public_id", "created_at", "updated_at", "last_login_at"]
    fieldsets = (
        (None, {"fields": ("phone_number", "password")}),
        (
            "Profile",
            {
                "fields": (
                    "full_name",
                    "email",
                    "profile_picture_url",
                    "language_preference",
                    "theme_preference",
                )
            },
        ),
        (
            "Status",
            {
                "fields": (
                    "is_phone_verified",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Social login",
            {"fields": ("social_provider", "social_id")},
        ),
        (
            "Meta",
            {"fields": ("public_id", "last_login_at", "created_at", "updated_at")},
        ),
    )
    add_fieldsets = (
        (None, {"fields": ("phone_number", "full_name", "password1", "password2")}),
    )


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ["phone_number", "code", "purpose", "is_used", "expires_at", "created_at"]
    list_filter = ["purpose", "is_used"]
    search_fields = ["phone_number"]
