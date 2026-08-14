from django.contrib import admin

from .models import Hymn


@admin.register(Hymn)
class HymnAdmin(admin.ModelAdmin):
    list_display = ["number", "title_sw", "is_premium"]
    search_fields = ["title_sw", "title_en", "lyrics_sw"]
    ordering = ["number"]
