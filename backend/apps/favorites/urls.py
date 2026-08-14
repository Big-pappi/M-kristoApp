from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "favorites"

router = DefaultRouter()
router.register("", views.FavoriteViewSet, basename="favorite")

urlpatterns = [
    path("", include(router.urls)),
]
