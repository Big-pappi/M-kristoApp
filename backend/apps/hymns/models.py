from django.db import models


class Hymn(models.Model):
    """Tenzi. Matches `hymns`."""

    number = models.PositiveIntegerField(unique=True)
    title_sw = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255, blank=True, null=True)
    lyrics_sw = models.TextField()
    lyrics_en = models.TextField(blank=True, null=True)
    is_premium = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "hymns"
        ordering = ["number"]

    def __str__(self):
        return f"#{self.number} {self.title_sw}"
