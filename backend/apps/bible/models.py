from django.db import models


class BibleBook(models.Model):
    """One of the 66 books, bilingual names. Matches `bible_books`."""

    TESTAMENT_CHOICES = [("old", "Old Testament"), ("new", "New Testament")]

    name_sw = models.CharField(max_length=100)
    name_en = models.CharField(max_length=100)
    testament = models.CharField(max_length=3, choices=TESTAMENT_CHOICES)
    book_order = models.PositiveSmallIntegerField(unique=True)
    chapter_count = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bible_books"
        ordering = ["book_order"]

    def __str__(self):
        return self.name_sw


class BibleVerse(models.Model):
    """A single verse, both languages in one row. Matches `bible_verses`."""

    book = models.ForeignKey(BibleBook, on_delete=models.CASCADE, related_name="verses")
    chapter = models.PositiveSmallIntegerField()
    verse_number = models.PositiveSmallIntegerField()
    text_sw = models.TextField()
    text_en = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bible_verses"
        constraints = [
            models.UniqueConstraint(
                fields=["book", "chapter", "verse_number"], name="uniq_book_chapter_verse"
            )
        ]
        indexes = [models.Index(fields=["book", "chapter"])]
        ordering = ["book", "chapter", "verse_number"]

    def __str__(self):
        return f"{self.book.name_sw} {self.chapter}:{self.verse_number}"


class VerseOfTheDay(models.Model):
    """Curated short verse for the home screen (Neno la Leo source)."""

    verse = models.ForeignKey(BibleVerse, on_delete=models.RESTRICT, related_name="featured_days")
    display_date = models.DateField(unique=True)
    short_text_sw = models.TextField()
    short_text_en = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "verse_of_the_day"
        ordering = ["-display_date"]

    def __str__(self):
        return f"Verse of the Day — {self.display_date}"
