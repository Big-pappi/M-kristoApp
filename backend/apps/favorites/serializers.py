from rest_framework import serializers

from .models import Favorite


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = ["id", "content_type", "content_id", "created_at"]
        read_only_fields = ["id", "created_at"]
