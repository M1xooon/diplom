from django.db import models
from django.core.files.storage import FileSystemStorage
from users.models import User

file_system = FileSystemStorage(location='storage')

class FileModel(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    storage_file_name = models.CharField(unique=True, max_length=50)
    native_file_name = models.CharField(max_length=50)
    size = models.IntegerField(null=True)
    upload_date = models.DateField(auto_now_add=True, null=True)
    last_download_date = models.DateField(null=True)
    comment = models.TextField(max_length=100, null=True, blank=True)
    public_download_id = models.CharField(unique=True, max_length=50)
    file = models.FileField(storage=file_system, blank=True)
