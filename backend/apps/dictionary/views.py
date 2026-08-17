from django.db.models import Q
from rest_framework import permissions, viewsets

from .models import DictionaryTerm
from .serializers import DictionaryTermSerializer


class DictionaryTermViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/dictionary/?search=<neno gumu>
    Helps a user tap a hard word in a verse/devotion and get its meaning.
    """

    serializer_class = DictionaryTermSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = DictionaryTerm.objects.all()
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(Q(term_sw__icontains=search) | Q(term_en__icontains=search))
        return qs
