from django.urls import path
from .views import index, requestBaseDados, requestAddLinks

urlpatterns = [
    path('index', index, name='index'),
    path('requestBaseDados/', requestBaseDados, name='requestBaseDados'),
    path('requestAddLinks/', requestAddLinks, name='requestAddLinks'),
]
