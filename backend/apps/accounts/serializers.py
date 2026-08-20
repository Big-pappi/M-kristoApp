from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "public_id",
            "phone_number",
            "email",
            "full_name",
            "profile_picture_url",
            "language_preference",
            "theme_preference",
            "is_phone_verified",
            "created_at",
        ]
        read_only_fields = ["public_id", "is_phone_verified", "created_at"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["phone_number", "email", "full_name", "language_preference", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class RequestOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    purpose = serializers.ChoiceField(choices=["signup", "login", "reset_password"])


class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    code = serializers.CharField(max_length=6)
    purpose = serializers.ChoiceField(choices=["signup", "login", "reset_password"])
