from django.shortcuts import render
from django.http import JsonResponse

import json

from .models import DadosYoutube

def index(request):
    return render(request, 'index.html')

def requestBaseDados(request):
    print(request.method == 'POST')
    dados_json = json.loads(request.body)

    query_dados_youtube = DadosYoutube.objects.all()

    return JsonResponse({
        'mensagem': 'Teste Django',
        'dados_retorn': query_dados_youtube,
    })


