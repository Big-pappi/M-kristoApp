from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "dictionary"

router = DefaultRouter()
router.register("", views.DictionaryTermViewSet, basename="term")

urlpatterns = [
    path("", include(router.urls)),
]
