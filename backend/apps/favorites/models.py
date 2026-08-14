from django.conf import settings
from django.db import models


class Favorite(models.Model):
    """Polymorphic saved-items list. Matches `favorites`.

    content_type/content_id is an app-level pointer (not a DB FK) into one
    of: bible.BibleVerse, devotions.Devotion, prayers.Prayer, hymns.Hymn,
    dictionary.DictionaryTerm — see architecture/DATABASE_SCHEMA.md §8.
    """

    CONTENT_TYPE_CHOICES = [
        ("verse", "Bible verse"),
        ("devotion", "Devotion"),
        ("prayer", "Prayer"),
        ("hymn", "Hymn"),
        ("dictionary_term", "Dictionary term"),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorites")
    content_type = models.CharField(max_length=20, choices=CONTENT_TYPE_CHOICES)
    content_id = models.BigIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "favorites"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "content_type", "content_id"], name="uniq_user_content"
            )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} → {self.content_type}#{self.content_id}"
