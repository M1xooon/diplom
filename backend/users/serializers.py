from rest_framework import serializers
from users.models import User


class RegistrUserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password2']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return attrs

    def create(self, validated_data):
        # удаляем password2, он не нужен в модели
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = User.objects.create_user(**validated_data, password=password)


        return user
