"""
URL configuration for the M-Kristo backend.

All app APIs are namespaced under /api/v1/ (see guide.md §5, "API
contracts"). Each app owns its own urls.py under apps/<app>/urls.py.
"""

from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView

api_v1_patterns = [
    path("auth/", include("apps.accounts.urls")),
    path("bible/", include("apps.bible.urls")),
    path("devotions/", include("apps.devotions.urls")),
    path("prayers/", include("apps.prayers.urls")),
    path("hymns/", include("apps.hymns.urls")),
    path("dictionary/", include("apps.dictionary.urls")),
    path("notes/", include("apps.notes.urls")),
    path("favorites/", include("apps.favorites.urls")),
    path("subscriptions/", include("apps.subscriptions.urls")),
    path("notifications/", include("apps.notifications.urls")),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_patterns)),
]
