from rest_framework import permissions, viewsets

from .models import Payment, Plan, Subscription
from .serializers import PaymentSerializer, PlanSerializer, SubscriptionSerializer


class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/subscriptions/plans/ — public list of active plans."""

    queryset = Plan.objects.filter(is_active=True)
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny]


class SubscriptionViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/subscriptions/mine/ — the current user's subscriptions."""

    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Subscription.objects.filter(user=self.request.user).select_related("plan")


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/subscriptions/payments/ — the current user's payment history.
    Creating a real payment happens via a provider webhook (M-Pesa/Tigo Pesa
    push callback), not directly through this endpoint — see guide.md §6.
    """

    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)
