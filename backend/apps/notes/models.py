from django.conf import settings
from django.db import models


class Note(models.Model):
    """Personal note tied to a calendar date (Shajara/journal). Matches `notes`."""

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")
    note_date = models.DateField()
    title = models.CharField(max_length=255, blank=True, null=True)
    body = models.TextField()
    linked_verse = models.ForeignKey(
        "bible.BibleVerse", on_delete=models.SET_NULL, blank=True, null=True, related_name="notes"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "notes"
        indexes = [models.Index(fields=["user", "note_date"])]
        ordering = ["-note_date"]

    def __str__(self):
        return f"{self.user} — {self.note_date}"
