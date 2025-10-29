from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from django.views.static import serve
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/storage/', include('storage.urls')),

    # Раздача медиафайлов
    path('media/<path:path>/', serve, {'document_root': settings.MEDIA_ROOT}),

    # Редирект корня на фронтенд
    path('', RedirectView.as_view(url='http://localhost:3000/', permanent=False)),
]
