from rest_framework import generics

from . import serializers
from .models import File
from .serializers import FileSerializer
from rest_framework.permissions import AllowAny
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return File.objects.all()  # возвращаем все файлы без привязки к пользователю


@method_decorator(csrf_exempt, name='dispatch')
class FileUploadView(generics.CreateAPIView):
    serializer_class = FileSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        uploaded_file = self.request.FILES.get('file')
        if not uploaded_file:
            raise serializers.ValidationError({"file": "No file provided"})

        serializer.save(
            user=None,  # сессий нет, пользователь не передается
            size=uploaded_file.size,
            original_name=uploaded_file.name
        )

@method_decorator(csrf_exempt, name='dispatch')
class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [AllowAny]
