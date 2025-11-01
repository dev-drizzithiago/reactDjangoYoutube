from django.urls import path
from .views import index, requestBaseDados, requestAddLinks, csrf_token_view, download_link

urlpatterns = [
    path('index', index, name='index'),
    path('csrf_token_view/', csrf_token_view, name='csrf_token_view'),
    path('requestBaseDados/', requestBaseDados, name='requestBaseDados'),
    path('requestAddLinks/', requestAddLinks, name='requestAddLinks'),
    path('download_link/', download_link, name='download_link'),
]
