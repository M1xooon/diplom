import re
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers
from users.models import User


class RegistrUserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password_confirm',
                  'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def validate_username(self, value):
        """
        Валидация username:
        - от 3 до 30 символов
        - только латинские буквы, цифры, дефис и подчеркивание
        - должен начинаться с буквы
        """
        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters long"
            )

        if len(value) > 30:
            raise serializers.ValidationError(
                "Username must not exceed 30 characters"
            )

        if not re.match(r'^[a-zA-Z][a-zA-Z0-9_-]*$', value):
            raise serializers.ValidationError(
                "Username must start with a letter and contain only "
                "letters, numbers, hyphens, and underscores"
            )

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with this username already exists"
            )

        return value

    def validate_email(self, value):
        """
        Валидация email:
        - должен быть уникальным
        - должен соответствовать формату email
        """
        if not value:
            raise serializers.ValidationError("Email is required")

        # Базовая проверка формата email
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Enter a valid email address")

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists"
            )

        return value

    def validate_password(self, value):
        """
        Валидация пароля:
        - минимум 8 символов
        - должен содержать хотя бы одну заглавную букву
        - должен содержать хотя бы одну строчную букву
        - должен содержать хотя бы одну цифру
        - должен содержать хотя бы один специальный символ
        """
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long"
            )

        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter"
            )

        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter"
            )

        if not re.search(r'\d', value):
            raise serializers.ValidationError(
                "Password must contain at least one digit"
            )

        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError(
                "Password must contain at least one special character"
            )

        # Django встроенные валидаторы
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(list(e.messages))

        return value

    def validate(self, data):
        """Проверка совпадения паролей."""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                "password_confirm": "Passwords do not match"
            })
        return data

    def create(self, validated_data):
        """Создание пользователя."""
        validated_data.pop('password_confirm')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )

        return user
