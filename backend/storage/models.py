from django.db import models
from django.conf import settings
import uuid
import os

def user_directory_path(instance, filename):
    return f'user_files/{instance.user.username}/{uuid.uuid4().hex}_{filename}'

class File(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='files')
    original_name = models.CharField(max_length=255)
    file = models.FileField(upload_to=user_directory_path)
    size = models.BigIntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    last_downloaded = models.DateTimeField(null=True, blank=True)
    comment = models.CharField(max_length=255, blank=True)
    share_link = models.UUIDField(default=uuid.uuid4, unique=True)
