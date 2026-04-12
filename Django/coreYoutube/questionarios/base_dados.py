import sqlite3
from collections import defaultdict
from time import sleep


class BaseDadosQuestionarios:
    def __init__(self):
        self.conn_sql = None
        self.cursor = None

    def conexao_banco_sqlife(self):

        self.conn_sql = sqlite3.connect(database='questionarios')
        self.cursor = self.conn_sql.cursor()

        return self.conn_sql

    def creater_base_dados(self):
        comando_sql = """
            CREATE DATABASE questionarios
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_categorias(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS CATEGORIAS
            (
                id INT PRIMARY KEY,
                nome TEXT,             
                weight FLOAT
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_questao(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS PERGUNTAS
            (
                id INT PRIMARY KEY,
                categoria_id TEXT, 
                texto TEXT, 
                weight FLOAT,
                FOREIGN KEY(categoria_id) REFERENCES CATEGORIAS(id)
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_alternativas(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS ALTERNATIVAS
            (
                id int PRIMARY KEY,            
                texto TEXT,
                pergunta_id INT,
                FOREIGN KEY(pergunta_id) REFERENCES PERGUNTAS(id)
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_resposta_usuarios(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS RESPOSTA_USUARIO
            (
                alternatica_id DEFAULT '0',
                FOREIGN KEY(alternatica_id) REFERENCES ALTERNATIVAS(id)
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_usuarios(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS CADASTRO_USUARIO
            (
                id int PRIMARY KEY,            
                nome TEXT,
                Sobrenome TEXT,
                email TEXT,
                cpf int,
                termo_aceite_um BOOL,
                termo_aceite_dois BOOL                                
            );
        """
        self.cursor.execute(comando_sql)

        self.conn_sql.close()


class InsertIntoQuestionarios:
    def __init__(self, conn_base):
        self.conn_base_questionario = conn_base

    def insert_dados(self, lista_dados_inset):
        tabela = lista_dados_inset['tabela']

        for item in lista_dados_inset:

            comando_sql = """
                INSERT INTO TABLE CATEGORIAS
                (nome, weight)
                VALUE (%s, %s)
            """

if __name__ == '__main__':
    init_cnx_sqlit = BaseDadosQuestionarios()
    while True:
        print("""
        [1] Criar Base de Dados
        [2] Inserir Dados        
        """)

        while True:
            try:
                opc = int(input('Escolha uma Opção: '))
                break
            except ValueError:
                print('Opção incorreta')

        if opc == 1:

            conn_base = init_cnx_sqlit.conexao_banco_sqlife()
            init_cnx_sqlit.creater_tabela_categorias()
            init_cnx_sqlit.creater_tabela_questao()
            init_cnx_sqlit.creater_tabela_alternativas()
            init_cnx_sqlit.creater_tabela_resposta_usuarios()
            init_cnx_sqlit.creater_tabela_usuarios()

        if opc == 2:
            print('Adicionando dados...')
            tabelas = [
                'CATEGORIAS',
                'PERGUNTAS',
                'ALTERNATIVAS',
                'RESPOSTA_USUARIO'
                'CADASTRO_USUARIO'
            ]

            lista_dados = [
                {'CATEGORIAS': {
                        {'nome' 'Conhecimento da Legislação', 'weight' '30'},
                        {'nome' 'ERP e Tecnologia Fiscal', 'weight' '20'},
                        {'nome' 'Compras e Fornecedores', 'weight' '10'},
                        {'nome' 'CCadastro de Produtos/Serviços', 'weight' '10'},
                        {'nome' 'Estrutura Organizacional', 'weight' '10'},
                        {'nome' 'Formação de Preços', 'weight' '10'},
                        {'nome' 'Estratégia de Implantação', 'weight' '10'},
                    }
                },

                {'ALTERNATIVAS': {
                    'texto': "", 'score': ""
                    }
                },

                {'ALTERNATIVAS': {
                        'categoria_id': '1',
                        'texto': 'Como sua empresa acompanha mudanças na legislação fiscal?',
                        'weight': '30',
                        'alternatica_id': 1,
                    }
                }



            ]
            lista_tabelas = defaultdict(list)

            for tabela in tabelas:

                for dados in lista_dados:

                    lista_tabelas[tabela].append(

                    )

            conn_base = init_cnx_sqlit.conexao_banco_sqlife()
            print(conn_base)