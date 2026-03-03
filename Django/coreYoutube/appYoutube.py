"""
from pytubefix import Search

results = Search('GitHub Issue Best Practices')

for video in results.videos:
    print(f'Title: {video.title}')
    print(f'URL: {video.watch_url}')
    print(f'Duration: {video.length} sec')
    print('---')

Title: Good Practices with GitHub Issues
URL: https://youtube.com/watch?v=v1AeHaopAYE
Duration: 406 sec
---
Title: GitHub Issues Tips and Guidelines
URL: https://youtube.com/watch?v=kezinXSoV5A
Duration: 852 sec
---
Title: 13 Advanced (but useful) Git Techniques and Shortcuts
URL: https://youtube.com/watch?v=ecK3EnyGD8o
Duration: 486 sec
---
Title: Managing a GitHub Organization Tools, Tips, and Best Practices - Mark Matyas
URL: https://youtube.com/watch?v=1T4HAPBFbb0
Duration: 1525 sec
---
Title: Do you know the best way to manage GitHub Issues?
URL: https://youtube.com/watch?v=OccRyzAS4Vc
Duration: 534 sec
---
"""

from .models import DadosYoutube, MoviesSalvasServidor, MusicsSalvasServidor
from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.conf import settings

import requests
import logging
from pathlib import Path
from re import search, sub
from datetime import datetime
from os import path, listdir, remove

from moviepy import AudioFileClip
from pytubefix import YouTube

logging.basicConfig(
    level=logging.INFO,  # Nível mínimo de log
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("log_events_app_yt.log"),  # Salva em arquivo
        logging.StreamHandler(),  # Também mostra no console
    ]
)

def on_progress_(stream, chunk, bytes_remaining):
    total_size = stream.filesize
    bytes_download = total_size - bytes_remaining
    porcentagem = (bytes_download / total_size) * 100
    print(f'Download: {porcentagem:.2f} concluido...')

def validacao_nome_arquivo(filename):
    """
    Corrige o nome, remove os caracteres especiais, evita os erros na criação
    :param filename: recebe o nome do arquivo, caso tenha erro, arquivo será corrigido.
    :return:
    """
    return sub(r'[\\/:*?"<>|()\[\]{}!@#$%¨&`^_]', ' - ', filename)

def data_hora_certa():
    """
    Função pode ser chamddo em qualquer lugar do projeto, não recebe nenhum valor, apenas retorna.
    :return: Retorna a data com a "/" e no padrão pt-BR
    """
    valor_data = datetime.now()
    data_certa = valor_data.strftime('%d/%m/%Y - %H:%m')
    return data_certa

def data_timestamp():
    data_stamtime = datetime.now()
    return str(data_stamtime.timestamp()).split('.')[0]


class YouTubeDownload:

    PATH_MIDIA_MOVIES = path.join(settings.MEDIA_ROOT, 'movies')
    PATH_MIDIA_MOVIES_URL = 'movies'

    PATH_MIDIA_MUSICS = path.join(settings.MEDIA_ROOT, 'musics')
    PATH_MIDIA_MUSICS_URL = 'musics'

    PATH_MIDIA_TEMP = path.join(settings.MEDIA_ROOT, 'temp')

    def __init__(self):
        self.link = None
        self.conexao_banco = None
        self.cursor = None
        self._auto_link = None
        self._titulo_link = None
        self._duracao = None
        self._miniatura = None
        self._link_tube = None
        self._usuario_logado = None

        self._download_yt = None
        self._nome_validado = None

        self.creater_nome_midia = None
        self.nome_validado = None

        self.dados_retorno = {None}
        self.erro_processo = None
        self.mensagem_processo = None

    # Registrar o link na base de dados.
    def registrando_link_base_dados(self, link, usuario_logado):
        """
        - Assim você garante que:
        - O vídeo só existe uma vez no banco.
        - Vários utilizadores podem estar associados ao mesmo vídeo.
        - Não há erro de TypeError.

        """
        try:
            logging.info(f'Registrando link na base de dados')
            youtube = YouTube(link)
            query_user_logado = User.objects.filter(username=usuario_logado).first()

            # - Usei get_or_create para evitar duplicar vídeos já existentes.
            # - Se já existe, ele retorna o objeto.
            # - Se não existe, cria com os valores de defaults.
            dados_link, created = DadosYoutube.objects.get_or_create(
                link_tube=youtube.watch_url,
                defaults={
                    'autor_link': youtube.author,
                    'titulo_link': youtube.title,
                    'duracao': youtube.length,
                    'miniatura': youtube.thumbnail_url,
                }
            )

            # - Em vez de passar usuario no construtor, uso dados_link.usuarios.add(query_user_logado)
            # após salvar.
            dados_link.usuario.add(query_user_logado)

            logging.info('Link salvo na base de dados com sucesso')
            return True
        except Exception as error:
            print(error)
            logging.error(f'Não foi possível registrar o link: [{link}]')
            return False

    def removendo_link_base_dados(self, id_dados: int):
        """
        Metódo responsável por remover o link da base de dados.
        O link que será removido será apenas do usuário que solicitar.

        Quando o usuário adicionar, quando ele abre a página principal é o id único daquele link, não
        corre o risco de deletar outros.

        :param id_link: Recebe o valor do número do id do link.
        :return: Retorna a confirmação que o link foi deletado.
        """
        query_remocao_link = DadosYoutube.objects.get(id_dados=id_dados)
        query_remocao_caminho_movies = MoviesSalvasServidor.objects.filter(dados_youtube_id=query_remocao_link)
        query_remocao_caminho_musics = MusicsSalvasServidor.objects.filter(dados_youtube_id=query_remocao_link)

        if query_remocao_caminho_movies.exists():
            query_remocao_caminho_movies.delete()

        if query_remocao_caminho_musics.exists():
            query_remocao_caminho_musics.delete()

        query_remocao_link.delete()

        logging.warning('Link removido com sucesso')
        return 'Link removido com sucesso'

    # Faz download do arquivo em MP3.
    def download_music(self, id_entrada: int, usuario_logado):
        logging.info('Baixando mídia em MP3')

        # --------------------------------------------------------------------------------------------------------------
        # Query para buscar o link, na tabela de dados, para realizar o download em MP3
        query_validador_dados = DadosYoutube.objects.get(id_dados=id_entrada)

        self._auto_link = query_validador_dados.autor_link
        self._titulo_link = query_validador_dados.titulo_link
        self._link_tube = query_validador_dados.link_tube
        self._duracao = query_validador_dados.duracao
        self._miniatura = query_validador_dados.miniatura

        # Verifica se a midia já foi baixado por algum outro usuário
        if hasattr(query_validador_dados, 'musicssalvasservidor'):
            logging.info('Mídia adicionado ao seu usuário...')

            # Associa o usuário
            query_validador_dados.usuario.add(usuario_logado)

            self.erro_processo = 0
            self.mensagem_processo = 'Mídia adicionado ao seu usuário...'

            self.dados_retorno = {
                'erro_processo': self.erro_processo,
                'mensagem_processo': self.mensagem_processo,
            }

        else:

            dados_link, created = DadosYoutube.objects.get_or_create(
                link_tube=self._link_tube,
                defaults={
                    'autor_link': self._auto_link,
                    'titulo_link': self._titulo_link,
                    'duracao': self._duracao,
                    'miniatura': self._miniatura,
                }
            )

            # Monta o obj do YouTube para realizar o download e as separações dos links, miniatura, etc.
            self._download_yt = YouTube(self._link_tube)

            # Valida o nome do arquivo para ficar dentro do banco de dados.
            self.nome_validado = validacao_nome_arquivo(f"{self._auto_link}_{self._titulo_link}")

            # Cria o nome padrão para realizar o download e colocar o caminho no banco de dados.
            nome_m4a_to_mp3 = str(f"{self.nome_validado}.m4a")

            # Com o nome validade é colocado dentro da pasta com a extensão de MP3;
            path_url_midia = (str(
                Path(self.PATH_MIDIA_MUSICS_URL, f'{self.nome_validado}.mp3')
            ).replace('\\', '/'))

            # Se a midia não existir é feito o download
            try:
                stream = self._download_yt.streams.get_audio_only()
                stream.download(output_path=self.PATH_MIDIA_TEMP, filename=nome_m4a_to_mp3)

                print()
                print('---'*20)
                print('>> Download da mídia: {}'.format(nome_m4a_to_mp3))

            except Exception as error:
                logging.error(f"Erro no download da mídia 'm4a': {error}")
                return f"Erro no download da mídia 'm4a': {error}"

            _mp4_to_mp3 = self.mp4_to_mp3(nome_m4a_to_mp3)

            if _mp4_to_mp3:

                dados_musics = MusicsSalvasServidor.objects.create(
                    nome_arquivo=self.nome_validado,  # A extensão o método self.mp4_to_mp3 vai colocar.
                    path_arquivo=path_url_midia,
                    duracao_midia=self._duracao,
                    dados_youtube=query_validador_dados,
                )

                # Download da miniatura.
                response = requests.get(self._miniatura)

                # Salva as informações da miniatura no banco de dados.
                dados_musics.path_miniatura.save(
                    f"{self.nome_validado}.png",
                    ContentFile(response.content),
                    save=True# **
                )

                # Associa o usuário
                dados_link.usuario.add(usuario_logado)

                # --------------------------------------------------------------------------------------------------------------
                # Final do modulo
                self.erro_processo = 0
                self.mensagem_processo = 'Mídia adicionado ao seu usuário...'

                self.dados_retorno = {
                    'erro_processo': self.erro_processo,
                    'mensagem_processo': self.mensagem_processo,
                }
                logging.info(f"Download da mídia [{self.nome_validado}] concluido com sucesso.")

            else:
                self.erro_processo = 0
                self.mensagem_processo = 'Erro ao converter a midía m4a para MP3'

                self.dados_retorno = {
                    'erro_processo': self.erro_processo,
                    'mensagem_processo': self.mensagem_processo,
                }
                logging.error('Erro ao converter a midía m4a para MP3')

        return self.dados_retorno

    # Faz o download do arquivo em MP4
    def download_movie(self, id_entrada: int, usuario_logado):
        logging.info(f'Baixando mídia em MP4...')

        # Busca o link na base de dados.
        query_validador_dados = DadosYoutube.objects.get(id_dados=id_entrada)

        self._auto_link = query_validador_dados.autor_link
        self._titulo_link = query_validador_dados.titulo_link
        self._link_tube = query_validador_dados.link_tube
        self._duracao = query_validador_dados.duracao
        self._miniatura = query_validador_dados.miniatura

        if hasattr(query_validador_dados, 'moviessalvasservidor'):
            logging.info(f'Mídia adicionado ao seu usuário...')

            # Associa o usuário
            query_validador_dados.usuario.add(usuario_logado)

            self.erro_processo = 0
            self.mensagem_processo = 'Mídia adicionado ao seu usuário...'

            self.dados_retorno = {
                'erro_processo': self.erro_processo,
                'mensagem_processo': self.mensagem_processo,
            }
        else:
            logging.info(f'Download do vídeo selecionado...')

            # Cria o objeto para o YouTube
            download_yt = YouTube(self._link_tube)

            # Cria e valida o nome do arquivo.
            self._nome_validado = validacao_nome_arquivo(f"{self._auto_link}_{self._titulo_link}.mp4")
            logging.info(f"Nome Validado: {self._nome_validado}")

            # Com o nome validade é colocado dentro da pasta com a extensão de MP3;
            path_arquivo_mp4 = (str(
                Path(
                    self.PATH_MIDIA_MOVIES_URL,
                    f'{self._nome_validado}.mp4')
                ).replace('\\', '/'))

            logging.info(f"Caminho arquivo MP4: {path_arquivo_mp4}")

            dados_link, created = DadosYoutube.objects.get_or_create(
                link_tube=self._link_tube,
                defaults={
                    'autor_link': self._auto_link,
                    'titulo_link': self._titulo_link,
                    'link_tube': self._link_tube,
                    'duracao_midia': self._duracao,
                    'miniatura': self._miniatura,
                },
            )
            try:
                download = download_yt.streams.get_highest_resolution()
                download.download(output_path=self.PATH_MIDIA_MOVIES, filename=self._nome_validado)

                response_miniature = requests.get(self._miniatura)

                movies = MoviesSalvasServidor.objects.create(
                    nome_arquivo=self._nome_validado,
                    path_arquivo=path_arquivo_mp4,
                    duracao_midia=self._duracao,
                    dados_youtube=dados_link,
                )

                # Salva as informações da miniatura no banco de dados.
                movies.path_miniatura.save(
                    f"{self.nome_validado}.png",
                    ContentFile(response_miniature.content),
                    save=True  # **
                )
                dados_link.usuario.add(usuario_logado)

                # ------------------------------------------------------------------------------------------------------
                # Final do processo.
                self.erro_processo = 0
                self.mensagem_processo = 'Vídeo adicionado a sua conta com sucesso...'

                self.dados_retorno = {
                    'erro_processo': self.erro_processo,
                    'mensagem_processo': self.mensagem_processo,
                }

                logging.info('Vídeo adicionado a sua conta com sucesso...')

            except Exception as error:
                logging.error(f"Erro ao fazer o download: {error}")

                self.erro_processo = 1
                self.mensagem_processo = f"Erro ao fazer o download: {error}"
                self.dados_retorno = {
                    'erro_processo': self.erro_processo,
                    'mensagem_processo': self.mensagem_processo,
                }

        # Retorno final.
        return self.dados_retorno

    # Processo para transformar o arquivo de mp4 em mp3
    # Esse problema não tem nenhum não pode ser chamado pelo usuário, apenas para uso internet do app
    def mp4_to_mp3(self, nome_midia):
        logging.info(f"Conversão de mídia >> {nome_midia}")

        # Busca a quantidade de midias que estão dentro da pasta temp
        qtd_midias = listdir(self.PATH_MIDIA_TEMP)

        if len(qtd_midias) > 1:
            logging.warning('>> Existe mais de uma mídia na pasta de temporários. '
                            '>> Verifique com o desenvolvedor: ', len(qtd_midias))
            return False
        else:
            logging.info('Analisando arquivo de mídia para conversão...')

            for arquivo_m4a in listdir(self.PATH_MIDIA_TEMP):
                if search(f"{nome_midia}", arquivo_m4a):
                    print('>> ', arquivo_m4a)
                    m4a_file_abs = path.join(self.PATH_MIDIA_TEMP, arquivo_m4a)
                    print('>> ', m4a_file_abs)
                    mp3_file = path.join(self.PATH_MIDIA_MUSICS, f"{arquivo_m4a.replace('m4a', 'mp3')}")
                    print('>> ', mp3_file)

                    """#### Processa o MP4 para MP3"""
                    novo_mp3 = AudioFileClip(m4a_file_abs)
                    novo_mp3.write_audiofile(mp3_file)
                    remove(m4a_file_abs)
                    return True
                else:
                    logging.error(f"Mídia não encontrada: {nome_midia}")
                    return False

    # Valida se o link é valido.
    def validar_link_youtube(self, link):
        logging.info(f"Validando se link é YouTube")

        # Caso o link não esteja com 'https://', o próprio programa vai adicionar
        if 'https://' not in link[:9]:
            link = f"https://{link}"

        # Caso o link não possua o 'www.', eu também vou adicionar ao link.
        if 'www.' not in link[:13]:
            link = f"{link[:8]}www.{link[8:]}"

        # Por fim valida se o link realmente é do youtube
        if link[:23] != 'https://www.youtube.com':
            logging.error(f"Link não é valido: {link}")
            return False
        else:
            logging.info(f"Link valido: {link}")
            return True
