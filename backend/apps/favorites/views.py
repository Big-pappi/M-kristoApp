from rest_framework import permissions, viewsets

from .models import Favorite
from .serializers import FavoriteSerializer


class FavoriteViewSet(viewsets.ModelViewSet):
    """
    GET    /api/v1/favorites/?content_type=prayer
    POST   /api/v1/favorites/          {content_type, content_id}
    DELETE /api/v1/favorites/{id}/
    """

    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Favorite.objects.filter(user=self.request.user)
        content_type = self.request.query_params.get("content_type")
        if content_type:
            qs = qs.filter(content_type=content_type)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
