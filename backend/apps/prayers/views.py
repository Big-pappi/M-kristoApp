from rest_framework import permissions, viewsets

from .models import Prayer, PrayerCategory
from .serializers import PrayerCategorySerializer, PrayerSerializer


class PrayerCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/prayers/categories/?kind=sala (or novena)"""

    serializer_class = PrayerCategorySerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = PrayerCategory.objects.prefetch_related("prayers").all()
        kind = self.request.query_params.get("kind")
        if kind:
            qs = qs.filter(kind=kind)
        return qs


class PrayerViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/prayers/items/?category=<id>"""

    serializer_class = PrayerSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Prayer.objects.select_related("category").all()
        category_id = self.request.query_params.get("category")
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs
