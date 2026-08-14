from rest_framework import permissions, viewsets

from .models import Note
from .serializers import NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    """
    Personal calendar/journal (Shajara). A user only ever sees their own
    notes.

    GET    /api/v1/notes/?date=2026-08-14
    POST   /api/v1/notes/
    PATCH  /api/v1/notes/{id}/
    DELETE /api/v1/notes/{id}/
    """

    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Note.objects.filter(user=self.request.user)
        note_date = self.request.query_params.get("date")
        if note_date:
            qs = qs.filter(note_date=note_date)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
