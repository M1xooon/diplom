from django.urls import path, include

from storage.views import FileView, get_link, get_file
from users.views import login_view, logout_view, get_csrf_token, me_view, get_detail_user_list, delete_user, \
    RegistrUserView

urlpatterns = [
    path('api/auth/login/', login_view),
    path('api/auth/logout/', logout_view),
    path('api/auth/get_csrf/', get_csrf_token),
    path('api/auth/me/', me_view),
    path('api/detail_users_list/', get_detail_user_list),
    path('api/delete_user/<int:user_id>/', delete_user),
    path('api/registr/', RegistrUserView.as_view()),
    path('api/files/', FileView.as_view()),
    path('api/link/', get_link),
    path('api/link/<str:link>/', get_file),
    path('', include('frontend.urls')),
]
