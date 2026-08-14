from django.utils import timezone
from rest_framework import permissions, viewsets

from .models import Devotion
from .serializers import DevotionSerializer


class DevotionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/devotions/?type=neno_la_leo
    GET /api/v1/devotions/today/?type=neno_la_leo
    """

    serializer_class = DevotionSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Devotion.objects.all()
        devotion_type = self.request.query_params.get("type")
        if devotion_type:
            qs = qs.filter(type=devotion_type)
        if self.request.query_params.get("today") == "1":
            qs = qs.filter(devotion_date__lte=timezone.localdate()).order_by("-devotion_date")
        return qs
