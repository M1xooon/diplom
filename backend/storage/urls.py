from django.urls import path
from .views import FileListView, FileUploadView, FileDetailView, download_file_view

urlpatterns = [
    path('files/', FileListView.as_view()),
    path('files/upload/', FileUploadView.as_view()),
    path('files/<int:pk>/', FileDetailView.as_view()),
    path('files/<int:pk>/download/', download_file_view),
]
