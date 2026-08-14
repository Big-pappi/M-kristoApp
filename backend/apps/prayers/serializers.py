from rest_framework import serializers

from .models import Prayer, PrayerCategory


class PrayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prayer
        fields = [
            "id",
            "category",
            "day_number",
            "title_sw",
            "title_en",
            "body_sw",
            "body_en",
            "order_index",
        ]


class PrayerCategorySerializer(serializers.ModelSerializer):
    prayers = PrayerSerializer(many=True, read_only=True)

    class Meta:
        model = PrayerCategory
        fields = ["id", "name_sw", "name_en", "kind", "is_premium", "order_index", "prayers"]
