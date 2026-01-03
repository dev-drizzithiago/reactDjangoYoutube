import os
import uuid
import json

from urllib.parse import quote

from django.core.cache import cache
from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login, logout


from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
from DjangoYouTube import settings

from .appYoutube import YouTubeDownload
from .models import DadosYoutube, MoviesSalvasServidor, MusicsSalvasServidor


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

def credenciais_login(request):
    usuario_logado = request.user
    if request.method != "POST":
        return JsonResponse({
            'mensagem': 'É valido apenas POST',
        }, status=400)

    mensagem_erro = None
    erro_processo = None
    usuario_logado = None
    nome_usuario = None

    dados_json = json.loads(request.body)

    tipo_requisicao = dados_json['tipoRequest']

    if tipo_requisicao == 'salvarCadastro':
        dados_novo_cadastro = dados_json['dadosCredencial']
        NAME = dados_novo_cadastro['nomeUsuario']
        USER = dados_novo_cadastro['userLogin']
        MAIL = dados_novo_cadastro['emailUsuario']
        PASS = dados_novo_cadastro['passUsuario']
        try:
            usuario = User.objects.create_user(
                first_name=NAME,
                username=MAIL,
                email=MAIL,
                password=PASS,
            )
            mensagem_erro = 'Cadastro realizado com sucesso.'
            erro_processo = 0
        except Exception as error:
            print('Erro ao cadastrar usuário')
            mensagem_erro = 'Erro ao cadastrar usuário.'
            erro_processo = 1

    # Processo para realizar o login do usuário quando entra com as credenciais.
    elif tipo_requisicao == 'realizarLogin':
        dados_para_login = dados_json['dadosCredencial']
        USER = dados_para_login['userLogin']
        PASS = dados_para_login['passUsuario']

        if not request.user.is_authenticated:
            user_auth = authenticate(request, username=USER, password=PASS)
            if user_auth is not None:
                login(request, user_auth)  # Cria uma sessão automatico
                request.session['usuario_id'] = user_auth.id
                request.session['usuario_nome'] = user_auth.first_name
                request.session['usuario_mail'] = user_auth.email
                usuario_logado = request.user.is_authenticated
                erro_processo = 0
            else:
                print('Credenciais inválidas')
                mensagem_erro = 'Credenciais inválidas'
                nome_usuario = request.user
                usuario_logado = request.user.is_authenticated
                erro_processo = 2
        elif request.user.is_authenticated:
            print('Usuário logado: ', request.user.is_authenticated)
            mensagem_erro = f'Usuário logado: {request.user.is_authenticated}',
            usuario_logado = request.user.is_authenticated
            erro_processo = 0
        else:
            print('Processo invalido')
            mensagem_erro = 'Processo invalido'
            usuario_logado = request.user.is_authenticated
            erro_processo = 1

    # Processo para verificar se o usuário está logado
    elif tipo_requisicao == 'verificarUsuarioLogado':
        if request.user.is_authenticated:
            id_usuario = request.session.get('usuario_id')
            nome_usuario = request.session.get('usuario_nome')
            mail_usuario = request.session.get('usuario_mail')
            usuario_logado = request.user.is_authenticated
            erro_processo = 0
        else:
            usuario_logado = request.user.is_authenticated
            print('Usuário logado: ', request.user.is_authenticated)
            usuario_logado = request.user.is_authenticated
            erro_processo = 0

    # Processo para deslogar o usuário
    elif tipo_requisicao == 'deslogarUsuario':
        logout(request)
        mensagem_erro = 'Usuário deslogado'
        erro_processo = 0
        usuario_logado = False

    print('Usuário logado: ', request.user.is_authenticated)
    print('Nome do usuário: ', request.user)

    return JsonResponse({
        'mensagem_erro': mensagem_erro,
        'erro_processo': erro_processo,
        'nome_usuario': nome_usuario,
        'usuario_logado': usuario_logado,
    })

# @csrf_protect
def requestBaseDados(request):
    """
    Recupara os dados de link do usuário
    :param request:
    :return:
    """
    lista_dados_django = []

    mensagem = None
    erro_processo = None

    if request.method != "POST":
        return JsonResponse({
            'mensagem': 'É valido apenas POST',
        }, status=400)
    usuario_logado = request.user

    if request.user.is_authenticated:
        dados_json = json.loads(request.body)
        query_dados_youtube = DadosYoutube.objects.filter(usuario=usuario_logado).order_by('-id_dados').values()

        for item in query_dados_youtube:
            lista_dados_django.append({
                'id_dados': item['id_dados'],
                'link_tube': item['link_tube'],
                'autor_link': item['autor_link'],
                'titulo_link': item['titulo_link'],
                'miniatura': item['miniatura'],
            })
    else:
        mensagem = 'Usuário não esta logado.'
        erro_processo = 666

    return JsonResponse({
        'mensagem': mensagem,
        'erro_processo': erro_processo,
        'dados_django': lista_dados_django,
    })

# @csrf_protect
def requestAddLinks(request):
    obj_app_youtube = YouTubeDownload()
    usuario_logado = request.user

    if request.method != 'POST':
        return JsonResponse({
            'mensagem': 'É valido apenas POST'
        })

    if not request.user.is_authenticated:
        return JsonResponse({
            'user_deslogado': 1
        })

    dados_json = json.loads(request.body)

    link_entrada = dados_json['link']
    response_validacao_link = obj_app_youtube.validar_link_youtube(link_entrada)

    if response_validacao_link:
        response_resitro_link = obj_app_youtube.registrando_link_base_dados(link_entrada, usuario_logado)
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
    usuario_logado = request.user
    dados_json = json.loads(request.body)

    # Separa as informações que irão para o app de download
    id_dados = dados_json['id_dados']
    midia_down = dados_json['midia']

    inicio_obj_yt_registro = YouTubeDownload()

    if midia_down == 'MP3':
        resultado_download = inicio_obj_yt_registro.download_music(id_dados, usuario_logado)
    elif midia_down == 'MP4':
        resultado_download = inicio_obj_yt_registro.download_movie(id_dados, usuario_logado)

    return JsonResponse({
        'mensagem': resultado_download,
    })

def remove_link(request):
    dados_json = json.loads(request.body)
    id_dados = int(dados_json['id_dados'])

    inicio_obj_yt_delete = YouTubeDownload()
    retorno_processo = inicio_obj_yt_delete.removendo_link_base_dados(id_dados)

    mensagem_processo = retorno_processo
    return JsonResponse({
        'mensagem_processo': mensagem_processo
    })

def listagem_midias(request):
    lista_midias_django = []
    usuario_logado = request.user
    mensagem_processo = None
    erro_processo = 0

    dados_json = json.loads(request.body)

    if request.user.is_authenticated:
        if dados_json['tipoMidia'] == 'MP4':
            query_dados_midias = MoviesSalvasServidor.objects.filter(usuario=usuario_logado).order_by('-id_movies').values()
            key_midia = 'id_movies'
        elif dados_json['tipoMidia'] == 'MP3':
            query_dados_midias = MusicsSalvasServidor.objects.filter(usuario=usuario_logado).order_by('-id_music').values()
            key_midia = 'id_music'
        else:
            mensagem_processo = 'Tipo de mídia não existe'
            erro_processo = 1

        for item in query_dados_midias:
            lista_midias_django.append({
                key_midia: item[key_midia],
                'nome_arquivo': item['nome_arquivo'],
                'duracao_midia': item['duracao_midia'],
                'path_arquivo': item['path_arquivo'],
                'path_miniatura': item['path_miniatura'],
            })
    else:
        mensagem_processo = 'Usuário não esta logado.'
        erro_processo = 666

    return JsonResponse({
        'mensagem_processo': mensagem_processo,
        'erro_processo': erro_processo,
        'dados_django': lista_midias_django,
    })

def preparar_midias_to_download(request):
    if request.method != "POST":
        return JsonResponse({
            'mensagem_processo': 'Apenas POST é permitido',
            'erro_processo': 1
        })

    mensagem_erro = None
    erro_processo = None

    dados_json = json.loads(request.body)

    caminho_relativo = dados_json['linkDownload']
    caminho_abs_midia = os.path.normpath(os.path.join(settings.MEDIA_ROOT, caminho_relativo))

    nome_da_midia = os.path.basename(caminho_abs_midia)

    token = str(uuid.uuid4())

    cache.set(token, caminho_abs_midia, timeout=600)
    download_url = f"/download_da_midia/?token={token}"

    return JsonResponse({
        'mensagem_erro': mensagem_erro,
        'erro_processo': erro_processo,
        'download_url': download_url,
    })

def download_da_midia(request):
    token = request.GET.get('token')
    caminho_arquivo = cache.get(token)

    if not caminho_arquivo or not os.path.exists(caminho_arquivo):
        return JsonResponse({
            'mensagem_erro': 'Token invalido ou expirado.',
            'erro_processo': 1,
        })
    with open(caminho_arquivo, 'rb') as file:
        response = HttpResponse(file.read(), content_type='application/octet-stream')
        response['Content-Disposition'] = f'attachment; filename="{quote(os.path.basename(caminho_arquivo))}"'
    return response

def consultar_progresso(request):
    token = request.GET.get('token')
    progresso = cache.get(f"Progresso_{token}", 0)
    return JsonResponse({
        'progresso': progresso
    })

def removendo_midias(request):
    usuario_logado = request.user
    if request.method != "POST":
        return JsonResponse({
            'mensagem': 'É valido apenas POST',
        }, status=400)

    mensagem_processo = None
    erro_processo = None
    dados_json = json.loads(request.body)

    print(dados_json)

    id_midia = dados_json['idMidia']
    tipo_midia = dados_json['tipoMidia']

    if tipo_midia == 'MP3':
        query_mp3_remove = MusicsSalvasServidor.objects.filter(id_music=id_midia)

        dados_caminho_minuatura = query_mp3_remove[0].path_miniatura
        caminho_abs_miniatura = os.path.join(settings.MEDIA_ROOT, dados_caminho_minuatura)

        print(caminho_abs_miniatura)

        # path_arquivo_abs_midia = os.path.join(
        #     settings.MEDIA_ROOT, query_mp3_remove[0].path_arquivo
        # ).replace('\\', '/')
        #
        # path_arquivo_abs_miniatura = os.path.join(
        #     settings.MEDIA_ROOT, query_mp3_remove[0].path_miniatura
        # ).replace('\\', '/')

        # Remover midia
        # os.remove(path_arquivo_abs_midia)

        # Remover base MusicsSalvasServidor
        # query_mp3_remove[0].delete()

        # Remover miniatura
        # print(path_arquivo_abs_miniatura)

    elif tipo_midia == 'MP4':
        print('Removendo MP4')

    return JsonResponse({
        'mensagem_processo': mensagem_processo,
        'erro_processo': erro_processo,
    })
