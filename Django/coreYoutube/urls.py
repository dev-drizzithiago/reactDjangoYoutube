from django.urls import path
from .views import index, requestBaseDados

urlpatterns = [
    path('index', index, name='index'),
    path('requestBaseDados/', requestBaseDados, name='requestBaseDados')
]
