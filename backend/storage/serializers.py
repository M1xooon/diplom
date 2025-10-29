from rest_framework import serializers
from .models import File

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'
        read_only_fields = ['user', 'size', 'uploaded_at', 'last_downloaded', 'share_link']
