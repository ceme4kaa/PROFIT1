from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('<str:lang>/', views.index, name='home_lang'),
]