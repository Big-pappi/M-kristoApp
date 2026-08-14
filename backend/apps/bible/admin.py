from django.contrib import admin

from .models import BibleBook, BibleVerse, VerseOfTheDay


@admin.register(BibleBook)
class BibleBookAdmin(admin.ModelAdmin):
    list_display = ["book_order", "name_sw", "name_en", "testament", "chapter_count"]
    ordering = ["book_order"]


@admin.register(BibleVerse)
class BibleVerseAdmin(admin.ModelAdmin):
    list_display = ["book", "chapter", "verse_number", "text_sw"]
    list_filter = ["book"]
    search_fields = ["text_sw", "text_en"]


@admin.register(VerseOfTheDay)
class VerseOfTheDayAdmin(admin.ModelAdmin):
    list_display = ["display_date", "verse", "short_text_sw"]
    ordering = ["-display_date"]
