from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, UserListView,
    UserDeleteView, UserUpdateAdminView, AuthCheckView
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('auth-check/', AuthCheckView.as_view()),
    path('users/', UserListView.as_view()),
    path('users/<int:pk>/', UserDeleteView.as_view()),
    path('users/<int:pk>/admin/', UserUpdateAdminView.as_view()),
]
