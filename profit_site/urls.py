from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('yandex_5b9223d505b81cda.html', TemplateView.as_view(template_name='yandex_5b9223d505b81cda.html')),
    path('', include('main.urls')),
]