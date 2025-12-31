from django.urls import path
from .views import (
    index,
    requestBaseDados,
    requestAddLinks,
    csrf_token_view,
    download_link,
    remove_link,
    listagem_midias,
    preparar_midias_to_download,
    download_da_midia,
    credenciais_login,
    removendo_midias,
)

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('index', index, name='index'),
    path('credenciais_login/', credenciais_login, name='credenciais_login'),
    path('csrf_token_view/', csrf_token_view, name='csrf_token_view'),
    path('requestBaseDados/', requestBaseDados, name='requestBaseDados'),
    path('requestAddLinks/', requestAddLinks, name='requestAddLinks'),
    path('download_link/', download_link, name='download_link'),
    path('remove_link/', remove_link, name='remove_link'),
    path('listagem_midias/', listagem_midias, name='listagem_midias'),
    path('preparar_midias_to_download/', preparar_midias_to_download, name='preparar_midias_to_download'),
    path('download_da_midia/', download_da_midia, name='download_da_midia'),
    path('removendo_midias/', removendo_midias, name='removendo_midias'),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
