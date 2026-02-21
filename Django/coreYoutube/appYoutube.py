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
    return sub(r'[\\/:*?"<>|()\[\]{}!@#$%¨&`^_]', '', filename)

def data_hora_certa():
    """
    Função pode ser chamddo em qualquer lugar do projeto, não recebe nenhum valor, apenas retorna.
    :return: Retorna a data com a "/" e no padrão pt-BR
    """
    valor_data = datetime.now()
    data_certa = valor_data.strftime('%d/%m/%Y - %H:%m')
    return data_certa

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
        self._usuario = None

        self._download_yt = None
        self._nome_validado = None

        self.creater_nome_midia = None
        self.nome_validado = None

    # Registrar o link na base de dados.
    def registrando_link_base_dados(self, link, usuario_logado):
        logging.info(f'Registrando link na base de dados')
        session = requests.session()
        # response = session.get("http://192.168.15.250:8080/usuario_logado/")
        youtube = YouTube(link)

        query_user_logado = User.objects.filter(username=usuario_logado)[0]

        dados_link = DadosYoutube(
            autor_link=youtube.author,
            titulo_link=youtube.title,
            duracao=youtube.length,
            miniatura=youtube.thumbnail_url,
            link_tube=youtube.watch_url,
            usuario=query_user_logado,
        )
        try:
            dados_link.save()
            logging.info('Link salvo na base de dados com sucesso')
            return True
        except Exception as error:
            logging.error(f'Não foi possível registrar o link: [{link}]')
            return False

    def removendo_link_base_dados(self, id_dados: int):
        """
        Metódo responsável por remover o link da base de dados.
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
        # Query para buscar o link para realizar o download em MP3
        query_validador_dados = DadosYoutube.objects.filter(id_dados=id_entrada).values()
        for item in query_validador_dados:
            id_dados = item['id_dados']
            link_tube = item['link_tube']

        try:
            self._download_yt = YouTube(link_tube)
        except Exception as error:
            logging.error(f"Não foi possível criar o obj do YouTube: {error}")
            return 'Não foi possível criar o obj do YouTube'

        self.creater_nome_midia = str(f"{self._download_yt.author}_{self._download_yt.title}.mp3").strip()
        self.nome_validado = validacao_nome_arquivo(self.creater_nome_midia)

        # Formata os dados para o download da mídia
        ducarao_midia = f"{self._download_yt.length}"
        miniatura = self._download_yt.thumbnail_url

        path_url_midia = (str(
            Path(
                self.PATH_MIDIA_MUSICS_URL,
                self.nome_validado
                .strip()
                .replace(' - ', '_')
                .replace(' ', '_')
            )).replace('\\', '/'))

        nome_m4a_to_mp3 = str(
            self.nome_validado
            .strip()
            .replace(' - ', '_')
            .replace(' ', '_')
        ).replace('.mp3', '.m4a')

        nome_miniatura_png = f"{self.nome_validado.replace('.mp3', '_mp3')}.png"

        # Valida se o nome do arquivo é muito extenso; nome é baseado do "C:/" até o último carectere.
        if int(len(path.join(self.PATH_MIDIA_TEMP, self.nome_validado)) > 254):
            logging.warning('Nome do arquivo muito extenso')
            return 'Nome do arquivo muito extenso'

        # Verifica se já existe algum registro no banco de dados das mídias salvas.
        # Preciso pensar numa forma para todos os usuário adicionárem essa mídia
        query_validador_midia = MusicsSalvasServidor.objects.filter(nome_arquivo=self.nome_validado)

        if query_validador_midia.exists():
            logging.info(f"Midia [{self.nome_validado}] já existe, se a mídia não estiver abrindo, chame o dev.")
            print(usuario_logado)
            print(query_validador_midia[0].usuario)

            # if query_validador_midia[0].usuario == usuario_logado:
            #     print(query_validador_midia[0].usuario, usuario_logado)
            # else:
            #     pass

            return f"Midia já existe."

        # Se a midia não existir é feito o download
        try:
            stream = self._download_yt.streams.get_audio_only()
            stream.download(output_path=self.PATH_MIDIA_TEMP, filename=nome_m4a_to_mp3)
        except Exception as error:
            logging.error(f"Erro no download da mídia 'm4a': {error}")
            return f"Erro no download da mídia 'm4a': {error}"

        # Conversão só vai ocorrer se o download da mídia der certo.
        mp3_ok = self.mp4_to_mp3(nome_m4a_to_mp3)

        if mp3_ok:

            # Faz o download da miniatura
            response = requests.get(miniatura)
            query_user_logado = User.objects.filter(username=usuario_logado)[0]

            # Cria o obj para salvar as informações no banco de dados.
            musica = MusicsSalvasServidor(
                nome_arquivo=self.nome_validado,
                path_arquivo=path_url_midia,
                duracao_midia=ducarao_midia,
                dados_youtube_id=id_dados,
                usuario=query_user_logado,
            )

            # Salva a miniatura numa pasta especifica.
            musica.path_miniatura.save(
                nome_miniatura_png,
                ContentFile(response.content),
                save=False  # **
            )
            musica.save()

            logging.info(f"Download da mídia [{self.nome_validado}] concluido com sucesso.")
            return f"Download da mídia concluido com sucesso."
        else:
            logging.error('Erro ao converter a midía m4a para MP3')
            return 'Erro ao converter a midía m4a para MP3'

    # Faz o download do arquivo em MP4
    def download_movie(self, id_entrada: int, usuario_logado):
        """
        ** Se você colocasse save=True, o Django salvaria o objeto video imediatamente após salvar o arquivo,
        o que pode ser indesejado se o objeto ainda estiver incompleto ou se você quiser controlar melhor
        o momento do save().
        :param id_entrada: Recebe o id para ser feito uma query na base de dados
        :return: Mensagem de sucesso quando finalizar o download do vídeo.
        """
        logging.info(f'Baixando mídia em MP4...')
        print(self.PATH_MIDIA_MOVIES)
        print(self.PATH_MIDIA_MOVIES_URL)
        # Busca o link na base de dados.
        query_validador_dados = DadosYoutube.objects.filter(id_dados=id_entrada).values()
        for item in query_validador_dados:
            id_dados = item['id_dados']
            link_tube = item['link_tube']

        # Cria a o obj do youtube.
        try:
            download_yt = YouTube(link_tube)
        except Exception as error:
            logging.error(f"Erro ao criar o obj do youtube: {error}")
            return f"Erro ao criar o obj do youtube."

        creater_nome_midia = validacao_nome_arquivo(f"{download_yt.author}_{download_yt.title}.mp4")
        self._nome_validado = validacao_nome_arquivo(creater_nome_midia)
        duracao_midia = f"{download_yt.length}"
        miniatura = download_yt.thumbnail_url
        path_midia = str(Path(self.PATH_MIDIA_MOVIES_URL, self._nome_validado)).replace('\\', '/')

        query_validador_midia = MoviesSalvasServidor.objects.filter(nome_arquivo=self._nome_validado)

        if query_validador_midia.exists():
            logging.warning(f"Midia já existe: {self._nome_validado}")
            return 'Midia já existe'
        else:
            try:
                stream = download_yt.streams.get_highest_resolution()
                stream.download(output_path=self.PATH_MIDIA_MOVIES, filename=validacao_nome_arquivo(self._nome_validado))
            except Exception as error:
                logging.error(f"Erro ao fazer o download MP4: {error}")
                return 'Não foi possível fazer o download do vídeo...'

            query_user_logado = User.objects.filter(username=usuario_logado)[0]

            # Prepara o obj para salvar as informações na base de dados.
            video = MoviesSalvasServidor(
                nome_arquivo=self._nome_validado,
                path_arquivo=path_midia,
                duracao_midia=duracao_midia,
                dados_youtube_id=id_dados,
                usuario=query_user_logado,
            )

            # Faz o download da miniatura
            response = requests.get(miniatura)

            # Salva as informações da miniatura no banco de dados.
            video.path_miniatura.save(
                f"{self._nome_validado.replace('.mp4', '_mp4')}.png",
                ContentFile(response.content),
                save=False  # **
            )
            video.save()
            logging.info(f"Download do vídeo {self._nome_validado} realizado com sucesso")
            return "Download do vídeo realizado com sucesso"

    # Processo para transformar o arquivo de mp4 em mp3
    # Esse problema não tem nenhum não pode ser chamado pelo usuário, apenas para uso internet do app
    def mp4_to_mp3(self, nome_midia):
        logging.info(f"Conversão de mídia - {nome_midia}")

        # Busca a quantidade de midias que estão dentro da pasta temp
        qtd_midias = listdir(self.PATH_MIDIA_TEMP)

        if len(qtd_midias) > 1:
            logging.warning('Existe mais de uma mídia na pasta de temporários. '
                            'Verifique com o desenvolvedor: ', len(qtd_midias))
            return False
        else:
            logging.info('Analisando arquivo de mídia para conversão...')

            for arquivo_m4a in listdir(self.PATH_MIDIA_TEMP):
                if search(f"{nome_midia}", arquivo_m4a):
                    print('----', arquivo_m4a)
                    m4a_file_abs = path.join(self.PATH_MIDIA_TEMP, arquivo_m4a)
                    print('----', m4a_file_abs)
                    mp3_file = path.join(self.PATH_MIDIA_MUSICS, f"{arquivo_m4a.replace('m4a', 'mp3')}")
                    print('----', mp3_file)

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


"""
Claro, Thiago! Aqui está um script em **Python** que você pode usar para **normalizar os nomes dos arquivos** em uma 
pasta, removendo ou substituindo caracteres especiais e garantindo que os nomes fiquem seguros para requisições GET 
em um servidor web como Django:

### 🧰 Script: Normalizador de nomes de arquivos

```python
import os
import urllib.parse

# Caminho da pasta onde estão os arquivos
pasta = r"H:\Estudos\reactDJangoyoutube\Django\media\miniaturas"

# Função para normalizar nomes de arquivos
def normalizar_nome(nome):
    # Remove espaços extras e codifica caracteres especiais
    nome_sem_espacos = nome.strip().replace(" ", "_")
    nome_codificado = urllib.parse.quote(nome_sem_espacos, safe="_-.")
    return nome_codificado

# Renomeia os arquivos na pasta
for nome_arquivo in os.listdir(pasta):
    caminho_antigo = os.path.join(pasta, nome_arquivo)
    nome_normalizado = normalizar_nome(nome_arquivo)
    caminho_novo = os.path.join(pasta, nome_normalizado)

    # Evita renomear se o nome já estiver normalizado
    if nome_arquivo != nome_normalizado:
        os.rename(caminho_antigo, caminho_novo)
        print(f"Renomeado: {nome_arquivo} → {nome_normalizado}")
    else:
        print(f"Já normalizado: {nome_arquivo}")
```

### ✅ O que esse script faz:
- Substitui espaços por `_`
- Codifica acentos e caracteres especiais com `urllib.parse.quote`
- Renomeia os arquivos diretamente na pasta
- Evita renomear arquivos que já estão normalizados

### ⚠️ Cuidados:
- Faça um **backup da pasta** antes de rodar o script.
- Verifique se o servidor Django está apontando corretamente para `MEDIA_ROOT` e `MEDIA_URL`.
- Se estiver usando thumbnails ou links em templates, atualize os caminhos conforme os novos nomes.

Se quiser, posso adaptar esse script para rodar dentro de um comando Django ou para gerar um log com os arquivos renomeados. Quer que eu faça isso também?
"""