from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "bible"

router = DefaultRouter()
router.register("books", views.BibleBookViewSet, basename="book")
router.register("verses", views.BibleVerseViewSet, basename="verse")

urlpatterns = [
    path("verse-of-the-day/", views.VerseOfTheDayView.as_view(), name="verse-of-the-day"),
    path("", include(router.urls)),
]
