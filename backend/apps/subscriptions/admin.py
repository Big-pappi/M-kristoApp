from django.contrib import admin

from .models import Payment, Plan, Subscription


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ["code", "name_sw", "price_amount", "price_currency", "duration_days", "is_active"]


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ["user", "plan", "status", "starts_at", "ends_at"]
    list_filter = ["status", "plan"]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["user", "provider", "amount", "currency", "status", "paid_at"]
    list_filter = ["provider", "status"]
    search_fields = ["provider_reference", "user__phone_number"]
