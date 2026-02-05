import os
from DjangoYouTube import settings


def verificar_pasta_media():

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