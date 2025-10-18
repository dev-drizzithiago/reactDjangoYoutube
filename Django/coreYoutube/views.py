from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def index(request):
    return render(request, 'index.html')

def requestBaseDados(request):


    return JsonResponse({
        'mensagem': 'Teste Django'
    })

