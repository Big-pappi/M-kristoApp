from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BibleBook, BibleVerse, VerseOfTheDay
from .serializers import BibleBookSerializer, BibleVerseSerializer, VerseOfTheDaySerializer


class BibleBookViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/bible/books/ and /books/{id}/"""

    queryset = BibleBook.objects.all()
    serializer_class = BibleBookSerializer
    permission_classes = [permissions.AllowAny]


class BibleVerseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/v1/bible/verses/?book=<id>&chapter=<n>
    Free-text search: /api/v1/bible/verses/?search=upendo
    """

    serializer_class = BibleVerseSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = BibleVerse.objects.select_related("book").all()
        book_id = self.request.query_params.get("book")
        chapter = self.request.query_params.get("chapter")
        search = self.request.query_params.get("search")
        if book_id:
            qs = qs.filter(book_id=book_id)
        if chapter:
            qs = qs.filter(chapter=chapter)
        if search:
            qs = qs.filter(text_sw__icontains=search)
        return qs


class VerseOfTheDayView(APIView):
    """GET /api/v1/bible/verse-of-the-day/ — today's short Swahili verse."""

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        today = timezone.localdate()
        votd = (
            VerseOfTheDay.objects.select_related("verse", "verse__book")
            .filter(display_date=today)
            .first()
        )
        if not votd:
            votd = (
                VerseOfTheDay.objects.select_related("verse", "verse__book")
                .filter(display_date__lte=today)
                .order_by("-display_date")
                .first()
            )
        if not votd:
            return Response({"detail": "Hakuna mstari wa leo bado."}, status=404)
        return Response(VerseOfTheDaySerializer(votd).data)
