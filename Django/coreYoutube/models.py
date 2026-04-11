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

    # - ManyToManyField precisa que o objeto seja salvo primeiro e
    # depois você use métodos como .add(), .set() ou .remove() para manipular a relação.
    usuario_dados = models.ManyToManyField(User, blank=True)

class MoviesSalvasServidor(Base):
    id_movie = models.AutoField(primary_key=True)
    nome_arquivo = models.CharField(max_length=255, null=True)
    path_arquivo = models.CharField(max_length=255, null=True)
    duracao_midia = models.IntegerField()
    path_miniatura = models.FileField(upload_to='miniaturas/', max_length=255)

    # - ManyToManyField precisa que o objeto seja salvo primeiro e
    # depois você use métodos como .add(), .set() ou .remove() para manipular a relação.
    usuario_movie = models.ManyToManyField(User, blank=True)

class MusicsSalvasServidor(Base):
    id_music = models.AutoField(primary_key=True)
    nome_arquivo = models.CharField(max_length=255, null=True)
    path_arquivo = models.CharField(max_length=255, null=True)
    duracao_midia = models.IntegerField()
    path_miniatura = models.FileField(upload_to='miniaturas/', max_length=255)

    # - ManyToManyField precisa que o objeto seja salvo primeiro e
    # depois você use métodos como .add(), .set() ou .remove() para manipular a relação.
    usuario_music = models.ManyToManyField(User, blank=True)


class BaseQuestionarioCategoria(models.Model):
    id_db = models.CharField(max_length=255, primary_key=True)
    nome_categoria = models.CharField(max_length=255)
    peso_categoria = models.DecimalField(decimal_places=2, max_digits=2, default=0.00)

    class Meta:
        abstract = True

class QuestionarioCategoria(BaseQuestionarioCategoria):
    class Meta:
        managed = False
        db_table = './questionarios/questionarios/CATEGORIAS'