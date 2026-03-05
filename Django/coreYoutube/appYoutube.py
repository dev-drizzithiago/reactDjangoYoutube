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

        # Declaração para dados do youtube
        self._auto_link = None
        self._titulo_link = None
        self._duracao = None
        self._link_miniatura = None
        self._link_video_youtube = None

        self._nome_m4a_to_mp3 = None
        self._path_arquivo_mp4 = None

        # Declaração para mídias
        self._nome_da_midia = None
        self._pasta_da_midia = None
        self._duracao_da_midia = None
        self._pasta_da_minuatura = None

        # Declaração para os
        self._download_yt = None

        self._nome_formatado = None

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
            logging.info(f'Registrar link na base de dados')
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

            # - Em vez de passar usuario no construtor, uso dados_link.usuario_dados.add(query_user_logado)
            # após salvar.
            dados_link.usuario_dados.add(query_user_logado)

            logging.info('Link salvo na base de dados com sucesso')
            return True

        except Exception as error:
            print(error)
            logging.error(f'Não foi possível registrar o link: [{link}]')
            return False

    def removendo_link_base_dados(self, id_dados: int, usuario_logado: str):
        """
        Metódo responsável por remover o link da base de dados.
        O link que será removido será apenas do usuário que solicitar.

        Quando o usuário adicionar, quando ele abre a página principal é o id único daquele link, não
        corre o risco de deletar outros.

        :param id_link: Recebe o valor do número do id do link.
        :return: Retorna a confirmação que o link foi deletado.
        """
        query_remocao_link = DadosYoutube.objects.get(id_dados=id_dados)
        dados_usuario = User.objects.filter(username=usuario_logado).first()
        query_remocao_link.usuario_dados.remove(dados_usuario)

        print('Removendo usuário: ', query_remocao_link.usuario_dados.remove(dados_usuario))
        print(query_remocao_link.usuario_dados.count() == 0, query_remocao_link.usuario_dados.count())

        if query_remocao_link.usuario_dados.count() == 0:
            if hasattr(query_remocao_link, 'musicssalvasservidor'):
                query_remocao_link.musicssalvasservidor.delete()

            if hasattr(query_remocao_link, 'moviessalvasservidor'):
                query_remocao_link.moviessalvasservidor.delete()

        logging.warning('Link removido com sucesso')
        return 'Link removido com sucesso'

    # Faz download do arquivo em MP3.
    def download_music(self, id_entrada: int, usuario_logado: str):

        logging.info('Baixando mídia em MP3')

        logging.info(f"ID: {id_entrada}")
        logging.info(f'Baixando mídia em MP3 para o usuário: {usuario_logado}')

        # --------------------------------------------------------------------------------------------------------------
        # Query para buscar o link, na tabela de dados, para realizar o download em MP3
        query_dados_midia = MusicsSalvasServidor.objects.filter(id_music=id_entrada).first()

        # Verifica se a midia já foi baixado por algum outro usuário
        if query_dados_midia:
            logging.info('Mídia adicionado ao seu usuário...')

            # Associa o usuário
            query_dados_midia.usuario_music.add(usuario_logado)

            self.erro_processo = 0
            self.mensagem_processo = 'Mídia adicionado ao seu usuário...'

            self.dados_retorno = {
                'erro_processo': self.erro_processo,
                'mensagem_processo': self.mensagem_processo,
            }

        else:

            # Se ainda não existe uma mídia salva no servidor, então é construida uma
            query_dados_youtube = DadosYoutube.objects.get(id_dados=id_entrada)

            self._auto_link = query_dados_youtube.autor_link
            self._titulo_link = query_dados_youtube.titulo_link
            self._duracao = query_dados_youtube.duracao
            self._link_miniatura = query_dados_youtube.miniatura
            self._link_video_youtube = query_dados_youtube.link_tube

            # Monta o obj do YouTube para realizar o download e as separações dos links, miniatura, etc.
            self._download_yt = YouTube(self._link_video_youtube)

            # Valida o nome do arquivo para ficar dentro do banco de dados.
            self._nome_formatado = validacao_nome_arquivo(f"{self._auto_link}_{self._titulo_link}")

            # Cria o nome padrão para realizar o download e colocar o caminho no banco de dados.
            self._nome_m4a_to_mp3 = str(f"{self._nome_formatado}.m4a")

            # Com o nome validade é colocado dentro da pasta com a extensão de MP3;
            self._pasta_da_midia = (str(
                Path(self.PATH_MIDIA_MUSICS_URL, f'{self._nome_formatado}.mp3')
            ).replace('\\', '/'))

            # Se a midia não existir é feito o download
            try:
                stream = self._download_yt.streams.get_audio_only()
                stream.download(output_path=self.PATH_MIDIA_TEMP, filename=self._nome_m4a_to_mp3)

                print()
                print('---' * 20)
                print('>> Download da mídia: {}'.format(self._nome_m4a_to_mp3))

            except Exception as error:
                logging.error(f"Erro no download da mídia 'm4a': {error}")
                return f"Erro no download da mídia 'm4a': {error}"

            _mp4_to_mp3 = self.mp4_to_mp3(self._nome_m4a_to_mp3)

            if _mp4_to_mp3:

                # Download da miniatura.
                response_miniatura = requests.get(self._link_miniatura)

                music = MusicsSalvasServidor.objects.create(
                    # ID automático
                    nome_arquivo=self._nome_formatado,
                    path_arquivo=self._pasta_da_midia,
                    duracao_midia=self._duracao,
                )

                # Salva as informações da miniatura no banco de dados.
                music.path_miniatura.save(
                    f"{self._nome_formatado}.png",
                    ContentFile(response_miniatura.content),
                    save=True  # **
                )

                # Associa o usuário a mídia
                music.usuario_music.add(usuario_logado)

                # --------------------------------------------------------------------------------------------------------------
                # Final do modulo
                self.erro_processo = 0
                self.mensagem_processo = 'Mídia adicionado ao seu usuário...'

                self.dados_retorno = {
                    'erro_processo': self.erro_processo,
                    'mensagem_processo': self.mensagem_processo,
                }
                logging.info(f"Download da mídia [{self._nome_formatado}] concluido com sucesso.")

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
    def download_movie(self, id_entrada: int, usuario_logado: str):

        query_validador_movie = MoviesSalvasServidor.objects.filter(id_movie=id_entrada).first()

        if query_validador_movie:

            query_validador_movie.usuario_movie.add(usuario_logado)

            self.erro_processo = 0
            self.mensagem_processo = 'Mídia adicionado ao seu usuário...'

            self.dados_retorno = {
                'erro_processo': self.erro_processo,
                'mensagem_processo': self.mensagem_processo,
            }
            logging.error('Mídia adicionado ao seu usuário...')

        else:
            # Busca o link na base de dados.
            query_validador_dados = DadosYoutube.objects.get(id_dados=id_entrada)

            self._auto_link = query_validador_dados.autor_link
            self._titulo_link = query_validador_dados.titulo_link
            self._duracao = query_validador_dados.duracao
            self._link_video_youtube = query_validador_dados.link_tube
            self._link_miniatura = query_validador_dados.miniatura
            logging.info(f'Download do vídeo selecionado...')

            # Cria o objeto para o YouTube
            download_yt = YouTube(self._link_video_youtube)

            # Cria e valida o nome do arquivo.
            self._nome_formatado = validacao_nome_arquivo(f"{self._auto_link}_{self._titulo_link}")
            logging.info(f"Nome Validado: {self._nome_formatado}")

            # Com o nome validade é colocado dentro da pasta com a extensão de MP3;
            self._path_arquivo_mp4 = (str(
                Path(
                    self.PATH_MIDIA_MOVIES_URL,
                    f'{self._nome_formatado}.mp4')
            ).replace('\\', '/'))

            try:
                download = download_yt.streams.get_highest_resolution()
                download.download(
                    output_path=self.PATH_MIDIA_MOVIES,
                    filename=f"{self._nome_formatado}.mp4",  # Adicionar a extensão ao nome do arquivo.
                )

                response_miniature = requests.get(self._link_miniatura)

                movie = MoviesSalvasServidor.objects.create(
                    # ID automático
                    nome_arquivo=self._nome_formatado,
                    path_arquivo=self._path_arquivo_mp4,
                    duracao_midia=self._duracao,
                )

                # Salva as informações da miniatura no banco de dados.
                movie.path_miniatura.save(
                    f"{self._nome_formatado}.png",
                    ContentFile(response_miniature.content),
                    save=True  # **
                )
                movie.usuario_movie.add(usuario_logado)

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
