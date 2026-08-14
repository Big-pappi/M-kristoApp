from rest_framework import serializers

from .models import BibleBook, BibleVerse, VerseOfTheDay


class BibleBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = BibleBook
        fields = ["id", "name_sw", "name_en", "testament", "book_order", "chapter_count"]


class BibleVerseSerializer(serializers.ModelSerializer):
    book_name_sw = serializers.CharField(source="book.name_sw", read_only=True)

    class Meta:
        model = BibleVerse
        fields = [
            "id",
            "book",
            "book_name_sw",
            "chapter",
            "verse_number",
            "text_sw",
            "text_en",
        ]


class VerseOfTheDaySerializer(serializers.ModelSerializer):
    verse = BibleVerseSerializer(read_only=True)

    class Meta:
        model = VerseOfTheDay
        fields = ["id", "verse", "display_date", "short_text_sw", "short_text_en"]
