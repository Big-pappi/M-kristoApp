from django.contrib import admin

from .models import Devotion


@admin.register(Devotion)
class DevotionAdmin(admin.ModelAdmin):
    list_display = ["type", "devotion_date", "title_sw", "is_premium"]
    list_filter = ["type", "is_premium"]
    search_fields = ["title_sw", "title_en", "body_sw"]
    ordering = ["-devotion_date"]
