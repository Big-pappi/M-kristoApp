from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "devotions"

router = DefaultRouter()
router.register("", views.DevotionViewSet, basename="devotion")

urlpatterns = [
    path("", include(router.urls)),
]
