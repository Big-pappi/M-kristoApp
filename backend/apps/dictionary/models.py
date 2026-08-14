from django.db import models


class DictionaryTerm(models.Model):
    """Complex/biblical word lookup and translation. Matches `dictionary_terms`."""

    term_sw = models.CharField(max_length=150, db_index=True)
    term_en = models.CharField(max_length=150, blank=True, null=True, db_index=True)
    definition_sw = models.TextField()
    definition_en = models.TextField(blank=True, null=True)
    related_scripture_reference = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "dictionary_terms"
        ordering = ["term_sw"]

    def __str__(self):
        return self.term_sw
