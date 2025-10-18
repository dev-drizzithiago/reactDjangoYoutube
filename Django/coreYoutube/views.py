from django.shortcuts import render
from django.http import JsonResponse

import json

# Create your views here.

def index(request):
    return render(request, 'index.html')

def requestBaseDados(request):
    if request.method == 'POST':
        dados_json = json.loads(request.body)

        return JsonResponse({
            'mensagem': 'Teste Django'
        })
    else:
        return JsonResponse({
            'mensagem': 'O method precisa ser POST',
        })

