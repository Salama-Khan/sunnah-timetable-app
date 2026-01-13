from django.urls import path
from . import views

urlpatterns = [
    path('times/', views.get_schedule, name='get_schedule'),
]