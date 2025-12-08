from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.validators import RegexValidator, EmailValidator
from .models import User


username_validator = RegexValidator(
    regex=r'^[A-Za-z][A-Za-z0-9]{3,19}$',
    message='Логин: латинские буквы и цифры, от 4 до 20 символов, первый символ — буква.'
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'is_admin']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(validators=[username_validator])
    email = serializers.EmailField(validators=[EmailValidator(message='Неверный формат email')])

    class Meta:
        model = User
        fields = ['username', 'full_name', 'email', 'password']

    def validate_password(self, value):
        # Use Django built-in validators (length, complexity if configured)
        validate_password(value)
        # additionally ensure at least one digit and one special char and one uppercase
        if not any(c.isdigit() for c in value):
            raise serializers.ValidationError('Пароль должен содержать хотя бы одну цифру.')
        if not any(c.isupper() for c in value):
            raise serializers.ValidationError('Пароль должен содержать хотя бы одну заглавную букву.')
        if not any(not c.isalnum() for c in value):
            raise serializers.ValidationError('Пароль должен содержать хотя бы один специальный символ.')
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            full_name=validated_data.get('full_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
