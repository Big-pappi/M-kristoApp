from django.contrib import admin

from .models import Favorite


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ["user", "content_type", "content_id", "created_at"]
    list_filter = ["content_type"]
