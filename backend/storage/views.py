from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import File
from .serializers import FileSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.http import FileResponse, Http404
from django.utils import timezone

# List files for current user; admin can pass ?user_id= to view other user's files
class FileListView(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # admin may supply ?user_id=<id>
        if user.is_admin and 'user_id' in self.request.query_params:
            try:
                uid = int(self.request.query_params['user_id'])
                return File.objects.filter(user_id=uid)
            except (ValueError, TypeError):
                return File.objects.none()
        return File.objects.filter(user=user)


class FileUploadView(generics.CreateAPIView):
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        uploaded_file = self.request.FILES.get('file')
        if not uploaded_file:
            raise serializers.ValidationError({"file": "No file provided"})
        # save under current user
        serializer.save(
            user=self.request.user,
            size=uploaded_file.size,
            original_name=uploaded_file.name
        )


class FileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        obj = super().get_object()
        # if not admin and trying to access other user's file -> forbid
        if not self.request.user.is_admin and obj.user != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You do not have access to this file")
        return obj

    def patch(self, request, *args, **kwargs):
        # allow renaming (update original_name or comment)
        return self.partial_update(request, *args, **kwargs)


# Download file via id (protected)
def download_file_view(request, pk):
    try:
        file_obj = File.objects.get(pk=pk)
    except File.DoesNotExist:
        raise Http404
    # permission: only owner or admin
    if not request.user.is_authenticated or (not request.user.is_admin and file_obj.user != request.user):
        from django.http import HttpResponseForbidden
        return HttpResponseForbidden()
    try:
        return FileResponse(open(file_obj.path, 'rb'), as_attachment=True, filename=file_obj.original_name)
    except Exception:
        raise Http404
