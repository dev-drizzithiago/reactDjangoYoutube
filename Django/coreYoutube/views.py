from django.shortcuts import render
from django.http import JsonResponse


from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

import json

from .models import DadosYoutube

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def requestBaseDados(request):
    lista_dados_django = []
    if request.method == "POST":
        dados_json = json.loads(request.body)

        query_dados_youtube = DadosYoutube.objects.all().values()

        for item in query_dados_youtube:
            lista_dados_django.append({
                'link_tube': item['link_tube'],
                'autor_link': item['autor_link'],
                'titulo_link': item['titulo_link'],
            })

        return JsonResponse({
            'mensagem': 'Teste Django',
            'dados_django': lista_dados_django,
        })
    else:
        return JsonResponse({
            'mensagem': 'error',
        }, status=400)

@csrf_exempt
def requestAddLinks(request):
    if request.method == 'POST':
        dados_json = json.loads(request.body)

        return JsonResponse({
            'mensagem': 'Links Salvo na Base de Dados com Sucesso.'
        })
    else:
        return JsonResponse({
            'mensagem': 'É valido apenas POST'
        })
