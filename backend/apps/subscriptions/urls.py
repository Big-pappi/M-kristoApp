from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "subscriptions"

router = DefaultRouter()
router.register("plans", views.PlanViewSet, basename="plan")
router.register("mine", views.SubscriptionViewSet, basename="subscription")
router.register("payments", views.PaymentViewSet, basename="payment")

urlpatterns = [
    path("", include(router.urls)),
]
