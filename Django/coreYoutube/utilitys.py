import os
from DjangoYouTube import settings


def verificar_pasta_media():
    """
    Garante que as pastas usadas para salvar as mídias (temp, movies, musics, miniaturas)
    existam dentro de MEDIA_ROOT, criando-as caso ainda não existam.
    :return:
    """
    try:
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'temp'))
    except FileExistsError:
        pass

    try:
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'movies'))
    except FileExistsError:
        pass

    try:
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'musics'))
    except FileExistsError:
        pass

    try:
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'miniaturas'))
    except FileExistsError:
        pass