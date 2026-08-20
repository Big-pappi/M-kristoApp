from rest_framework import serializers

from .models import DictionaryTerm


class DictionaryTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = DictionaryTerm
        fields = [
            "id",
            "term_sw",
            "term_en",
            "definition_sw",
            "definition_en",
            "related_scripture_reference",
        ]
