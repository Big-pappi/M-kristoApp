from rest_framework import permissions, viewsets

from .models import Hymn
from .serializers import HymnSerializer


class HymnViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/hymns/?search=<text>"""

    serializer_class = HymnSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Hymn.objects.all()
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(title_sw__icontains=search)
        return qs
