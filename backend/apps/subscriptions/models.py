import uuid

from django.conf import settings
from django.db import models


class Plan(models.Model):
    """Subscription plan (e.g. free, monthly premium, yearly premium)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.SlugField(max_length=40, unique=True)
    name_sw = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100, blank=True)
    description_sw = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    price_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_currency = models.CharField(max_length=3, default="TZS")
    duration_days = models.PositiveIntegerField(help_text="0 = lifetime / not applicable")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "plans"
        ordering = ["price_amount"]

    def __str__(self):
        return self.name_sw


class Subscription(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("expired", "Expired"),
        ("cancelled", "Cancelled"),
        ("pending", "Pending"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscriptions"
    )
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT, related_name="subscriptions")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "subscriptions"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} -> {self.plan.code} ({self.status})"


class Payment(models.Model):
    """A single payment/transaction, e.g. via M-Pesa, Tigo Pesa, card."""

    PROVIDER_CHOICES = [
        ("mpesa", "M-Pesa"),
        ("tigopesa", "Tigo Pesa"),
        ("airtelmoney", "Airtel Money"),
        ("card", "Card"),
        ("other", "Other"),
    ]
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("success", "Success"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments"
    )
    subscription = models.ForeignKey(
        Subscription, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments"
    )
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    provider_reference = models.CharField(max_length=120, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="TZS")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "payments"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.provider} - {self.amount} {self.currency} ({self.status})"
