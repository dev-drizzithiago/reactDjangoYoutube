from rest_framework import serializers
from .models import (
    QuestionariosCategorias,
    QuestionariosPerguntas,
    QuestionariosAlternativas
)

class AlternativasSerializers(serializers.ModelSerializer):
    class Meta:
        model = QuestionariosAlternativas
        fields = ['id', 'nivel', 'descricao', 'pontuacao']


class PerguntasSerializers(serializers.ModelSerializer):
    alternativas = AlternativasSerializers(many=True, source='questionariosalternativas_set')

    class Meta:
        model = QuestionariosPerguntas
        fields = ['id', 'questao', 'weight', 'alternativas']


class CategoriasSerializers(serializers.ModelSerializer):
    perguntas = PerguntasSerializers(many=True, source='questionariosperguntas_set')

    class Meta:
        model = QuestionariosCategorias
        fields = ['id', 'nome', 'weight', 'perguntas']