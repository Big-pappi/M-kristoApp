from django.contrib import admin

from .models import Note


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ["user", "note_date", "title"]
    list_filter = ["note_date"]
    search_fields = ["title", "body", "user__phone_number"]
    ordering = ["-note_date"]
