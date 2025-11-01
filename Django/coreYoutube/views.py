from django.shortcuts import render
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect

from .appYoutube import YouTubeDownload

import json

from .models import DadosYoutube

def index(request):
    return render(request, 'index.html')

@ensure_csrf_cookie
def csrf_token_view(request):
    """
    Função para enviar cookies com o csrf
    :param request:
    :return: Retorna um aviso para o react.
    """
    return JsonResponse({
        'mensagem': 'Token CSRF enviado',
    })

# @csrf_protect
def requestBaseDados(request):
    lista_dados_django = []
    if request.method != "POST":
        return JsonResponse({
            'mensagem': 'É valido apenas POST',
        }, status=400)

    dados_json = json.loads(request.body)
    query_dados_youtube = DadosYoutube.objects.all().order_by('-id_dados').values()

    for item in query_dados_youtube:
        lista_dados_django.append({
            'id_dados': item['id_dados'],
            'link_tube': item['link_tube'],
            'autor_link': item['autor_link'],
            'titulo_link': item['titulo_link'],
            'miniatura': item['miniatura'],
        })

    return JsonResponse({
        'mensagem': 'Teste Django',
        'dados_django': lista_dados_django,
    })

# @csrf_protect
def requestAddLinks(request):
    obj_app_youtube = YouTubeDownload()

    if request.method != 'POST':
        return JsonResponse({
            'mensagem': 'É valido apenas POST'
        })
    dados_json = json.loads(request.body)

    link_entrada = dados_json['link']
    response_validacao_link = obj_app_youtube.validar_link_youtube(link_entrada)

    if response_validacao_link:
        response_resitro_link = obj_app_youtube.registrando_link_base_dados(link_entrada)
        if response_resitro_link:
            mansagem_processo = 'Links Salvo na Base de Dados com Sucesso.'
            erro_processo = 0
        else:
            mansagem_processo = 'Erro ao salvar o link na base de dados.'
            erro_processo = 1
    else:
        mansagem_processo = 'Link não é válido para o processo.'
        erro_processo = 1

    return JsonResponse({
        'mensagem': mansagem_processo,
        'erro_processo': erro_processo,
    }, status=400)

def download_link(request):
    dados_json = json.loads(request.body)

    # Separa as informações que irão para o app de download
    id_dados = dados_json['id_dados']
    midia_down = dados_json['midia']

    inicio_obj_yt_registro = YouTubeDownload()

    if midia_down == 'MP3':
        resultado_download = inicio_obj_yt_registro.download_music(id_dados)
    elif midia_down == 'MP4':
        resultado_download = inicio_obj_yt_registro.download_movie(id_dados)

    return JsonResponse({
        'mensagem': resultado_download,
    })

def remove_link(request):
    dados_json = json.loads(request.body)
    id_link = int(dados_json['id_dados'])

    inicio_obj_yt_delete = YouTubeDownload()
    retorno_processo = inicio_obj_yt_delete.removendo_link_base_dados(id_link)

    mensagem_processo = retorno_processo
    return JsonResponse({
        'mensagem_processo': mensagem_processo
    })
