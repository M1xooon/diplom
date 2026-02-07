import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.db.models import Sum, Count
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.decorators import  permission_classes
from rest_framework.decorators import api_view

from users.models import User
from users.serializers import RegistrUserSerializer


class RegistrUserView(CreateAPIView):
    queryset = User.objects.all()

    serializer_class = RegistrUserSerializer

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrUserSerializer(data=request.data)

        data = {}

        if serializer.is_valid():
            serializer.save()

            data['response'] = True

            return Response(data, status=status.HTTP_200_OK)

        else:
            data = serializer.errors

            return Response(data, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_detail_user_list(request):
    result = User.objects.annotate(size=Sum('filemodel__size'), count=Count('filemodel__id')).values(
        'id', 'username', 'first_name', 'last_name', 'email', 'count', 'size', 'is_staff')

    if result:
        return Response(result, status=status.HTTP_200_OK)

    return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    user = User.objects.get(id=user_id)

    if user:
        user.delete()

        return JsonResponse({
            "message": "success",
        })

    return JsonResponse({
        "message": 'User not found',
    }, status=404)


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({
        "message": "csrf cookie set"
    })


@require_POST
def login_view(request):
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')

    if email is None or password is None:
        return JsonResponse({
            "message": "Please enter both email and password"
        }, status=400)

    user = authenticate(email=email, password=password)

    if user is not None:
        login(request, user)

        return JsonResponse({
            "message": "success",
        })

    return JsonResponse(
        {
            "message": "invalid credentials"
        }, status=400
    )

@require_POST
def logout_view(request):
    logout(request)

    return JsonResponse({
        "message": 'logout',
    })


def me_view(request):
    data = request.user

    return JsonResponse({
        "username": data.username,
        "isAdmin": data.is_staff,
    })
