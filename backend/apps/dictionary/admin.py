from django.contrib import admin

from .models import DictionaryTerm


@admin.register(DictionaryTerm)
class DictionaryTermAdmin(admin.ModelAdmin):
    list_display = ["term_sw", "term_en", "related_scripture_reference"]
    search_fields = ["term_sw", "term_en", "definition_sw"]
    ordering = ["term_sw"]
