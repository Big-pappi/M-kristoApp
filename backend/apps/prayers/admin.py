from django.contrib import admin

from .models import Prayer, PrayerCategory


class PrayerInline(admin.TabularInline):
    model = Prayer
    extra = 1
    fields = ["day_number", "title_sw", "order_index"]


@admin.register(PrayerCategory)
class PrayerCategoryAdmin(admin.ModelAdmin):
    list_display = ["name_sw", "kind", "is_premium", "order_index"]
    list_filter = ["kind", "is_premium"]
    inlines = [PrayerInline]


@admin.register(Prayer)
class PrayerAdmin(admin.ModelAdmin):
    list_display = ["title_sw", "category", "day_number", "order_index"]
    list_filter = ["category"]
    search_fields = ["title_sw", "body_sw"]
