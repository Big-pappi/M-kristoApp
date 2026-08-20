from rest_framework import serializers

from .models import Devotion


class DevotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Devotion
        fields = [
            "id",
            "type",
            "devotion_date",
            "title_sw",
            "title_en",
            "body_sw",
            "body_en",
            "scripture_reference",
            "is_premium",
        ]
