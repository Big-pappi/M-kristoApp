import uuid

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    """Users log in with phone_number, not username."""

    use_in_migrations = True

    def _create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError("Users must have a phone number.")
        user = self.model(phone_number=phone_number, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_user(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(phone_number, password, **extra_fields)

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_phone_verified", True)
        return self._create_user(phone_number, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    App account. Matches the `users` table in
    architecture/database_schema.sql.
    """

    LANGUAGE_CHOICES = [("sw", "Kiswahili"), ("en", "English")]
    THEME_CHOICES = [("light", "Light"), ("dark", "Dark")]
    SOCIAL_PROVIDER_CHOICES = [("google", "Google"), ("apple", "Apple")]

    public_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    phone_number = models.CharField(max_length=20, unique=True)
    email = models.EmailField(max_length=255, unique=True, null=True, blank=True)
    full_name = models.CharField(max_length=150)
    profile_picture_url = models.URLField(blank=True, null=True)
    language_preference = models.CharField(
        max_length=2, choices=LANGUAGE_CHOICES, default="sw"
    )
    theme_preference = models.CharField(
        max_length=10, choices=THEME_CHOICES, default="light"
    )
    is_phone_verified = models.BooleanField(default=False)
    social_provider = models.CharField(
        max_length=20, choices=SOCIAL_PROVIDER_CHOICES, blank=True, null=True
    )
    social_id = models.CharField(max_length=255, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    last_login_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = ["full_name"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.full_name} ({self.phone_number})"


class OTPVerification(models.Model):
    """One-time phone codes for signup/login/reset. Matches `otp_verifications`."""

    PURPOSE_CHOICES = [
        ("signup", "Signup"),
        ("login", "Login"),
        ("reset_password", "Reset password"),
    ]

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True, related_name="otp_codes"
    )
    phone_number = models.CharField(max_length=20, db_index=True)
    code = models.CharField(max_length=10)
    purpose = models.CharField(max_length=20, choices=PURPOSE_CHOICES)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "otp_verifications"

    def __str__(self):
        return f"OTP({self.phone_number}, {self.purpose})"
