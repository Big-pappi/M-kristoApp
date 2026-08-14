from django.db import models


class Devotion(models.Model):
    """Neno la Leo (long form), Tafakari, Somo. Matches `devotions`."""

    TYPE_CHOICES = [
        ("neno_la_leo", "Neno la Leo"),
        ("tafakari", "Tafakari"),
        ("somo", "Somo"),
    ]

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    devotion_date = models.DateField()
    title_sw = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255, blank=True, null=True)
    body_sw = models.TextField()
    body_en = models.TextField(blank=True, null=True)
    scripture_reference = models.CharField(max_length=100, blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "devotions"
        constraints = [
            models.UniqueConstraint(fields=["type", "devotion_date"], name="uniq_type_date")
        ]
        indexes = [models.Index(fields=["devotion_date"])]
        ordering = ["-devotion_date"]

    def __str__(self):
        return f"{self.get_type_display()} — {self.devotion_date}"
