from django.db import models
from django.db.models import PROTECT
from django.contrib.auth.models import User

class Base(models.Model):
    data_criacao = models.DateField('data_criacao', auto_now_add=True)
    class Meta:
        abstract = True

class DadosYoutube(Base):
    id_dados = models.AutoField(primary_key=True)
    autor_link = models.CharField(max_length=255)
    titulo_link = models.CharField(max_length=255)
    duracao = models.IntegerField()
    miniatura = models.URLField(max_length=255)
    link_tube = models.URLField(max_length=255)
    usuario = models.ForeignKey(User, on_delete=PROTECT, null=True, blank=True)

class MoviesSalvasServidor(Base):
    id_movies = models.AutoField(primary_key=True)
    nome_arquivo = models.CharField(max_length=255, null=True)
    path_arquivo = models.CharField(max_length=255, null=True)
    duracao_midia = models.IntegerField()
    path_miniatura = models.FileField(upload_to='miniaturas/', max_length=255)
    dados_youtube = models.ForeignKey(DadosYoutube, on_delete=PROTECT)
    usuario = models.ForeignKey(User, on_delete=PROTECT, null=True, blank=True)

class MusicsSalvasServidor(Base):
    id_music = models.AutoField(primary_key=True)
    nome_arquivo = models.CharField(max_length=255, null=True)
    path_arquivo = models.CharField(max_length=255, null=True)
    duracao_midia = models.IntegerField()
    path_miniatura = models.FileField(upload_to='miniaturas/', max_length=255)
    dados_youtube = models.ForeignKey(DadosYoutube, on_delete=PROTECT)
    usuario = models.ForeignKey(User, on_delete=PROTECT, null=True, blank=True)

