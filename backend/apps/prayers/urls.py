from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "prayers"

router = DefaultRouter()
router.register("categories", views.PrayerCategoryViewSet, basename="category")
router.register("items", views.PrayerViewSet, basename="prayer")

urlpatterns = [
    path("", include(router.urls)),
]
