from rest_framework import serializers

from .models import Payment, Plan, Subscription


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = [
            "id",
            "code",
            "name_sw",
            "name_en",
            "description_sw",
            "description_en",
            "price_amount",
            "price_currency",
            "duration_days",
        ]


class SubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=Plan.objects.all(), source="plan", write_only=True
    )

    class Meta:
        model = Subscription
        fields = ["id", "plan", "plan_id", "status", "starts_at", "ends_at", "created_at"]
        read_only_fields = ["id", "status", "starts_at", "ends_at", "created_at"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = [
            "id",
            "subscription",
            "provider",
            "provider_reference",
            "amount",
            "currency",
            "status",
            "paid_at",
            "created_at",
        ]
        read_only_fields = ["id", "status", "paid_at", "created_at"]
