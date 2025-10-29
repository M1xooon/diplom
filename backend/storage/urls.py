from django.urls import path
from .views import FileListView, FileUploadView, FileDetailView

urlpatterns = [
    path('files/', FileListView.as_view()),
    path('files/upload/', FileUploadView.as_view()),
    path('files/<int:pk>/', FileDetailView.as_view()),
]
