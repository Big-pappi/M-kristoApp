from django.db import models


class PrayerCategory(models.Model):
    """Groups prayers — e.g. a Sala set or a Novena. Matches `prayer_categories`."""

    KIND_CHOICES = [("sala", "Sala"), ("novena", "Novena")]

    name_sw = models.CharField(max_length=150)
    name_en = models.CharField(max_length=150, blank=True, null=True)
    kind = models.CharField(max_length=10, choices=KIND_CHOICES)
    is_premium = models.BooleanField(default=False)
    order_index = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "prayer_categories"
        ordering = ["kind", "order_index"]
        verbose_name_plural = "prayer categories"

    def __str__(self):
        return self.name_sw


class Prayer(models.Model):
    """Individual prayer text, or one Novena day. Matches `prayers`."""

    category = models.ForeignKey(
        PrayerCategory, on_delete=models.CASCADE, related_name="prayers"
    )
    day_number = models.PositiveSmallIntegerField(blank=True, null=True)
    title_sw = models.CharField(max_length=255)
    title_en = models.CharField(max_length=255, blank=True, null=True)
    body_sw = models.TextField()
    body_en = models.TextField(blank=True, null=True)
    order_index = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "prayers"
        indexes = [models.Index(fields=["category"])]
        ordering = ["category", "order_index", "day_number"]

    def __str__(self):
        return self.title_sw
