from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth import authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# -------------------------------
# Регистрация
# -------------------------------
@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# -------------------------------
# Логин
# -------------------------------
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            # отключаем сессию, поэтому login не нужен
            return Response({
                "id": user.id,
                "username": user.username,
                "full_name": user.full_name,
                "email": user.email,
                "is_admin": user.is_admin
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

# -------------------------------
# Логаут
# -------------------------------
@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # сессии нет, logout ничего не делает
        return Response({"message": "Logged out"})

# -------------------------------
# Список пользователей (только админ)
# -------------------------------
@method_decorator(csrf_exempt, name='dispatch')
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# -------------------------------
# Удаление пользователя
# -------------------------------
@method_decorator(csrf_exempt, name='dispatch')
class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# -------------------------------
# Изменение признака администратора
# -------------------------------
@method_decorator(csrf_exempt, name='dispatch')
class UserUpdateAdminView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        is_admin = request.data.get('is_admin')
        if isinstance(is_admin, bool):
            user.is_admin = is_admin
            user.save()
            return Response({"message": "Admin status updated"})
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)
