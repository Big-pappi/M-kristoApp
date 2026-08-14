from rest_framework import serializers

from .models import Hymn


class HymnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hymn
        fields = ["id", "number", "title_sw", "title_en", "lyrics_sw", "lyrics_en", "is_premium"]
