import sqlite3

class BaseDadosQuestionarios:
    def __init__(self):
        self.conn_sql = None
        self.cursor = None

    def conexao_banco_sqlife(self):

        self.conn_sql = sqlite3.connect(database='questionarios')
        self.cursor = self.conn_sql.cursor()

    def creater_base_dados(self):
        comando_sql = """
            CREATE DATABASE questionarios
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_categorias(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS CATEGORIAS
            (
                id int PRIMARY KEY,
                nome TEXT,             
                weight FLOAT
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_questao(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS PERGUNTAS
            (
                id int PRIMARY KEY,
                categoria_id TEXT, 
                texto TEXT, 
                weight FLOAT,
                options LIST
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_alternativas(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS ALTERNATIVAS
            (
                id int PRIMARY KEY,            
                texto TEXT,
                score INT
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_resposta_usuarios(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS RESPOSTA_USUARIO
            (
                questao_id INT,
                alternativa_id                
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

if __name__ == '__main__':
    init_cnx_sqlit = BaseDadosQuestionarios()
    init_cnx_sqlit.conexao_banco_sqlife()
    init_cnx_sqlit.creater_tabela_categorias()
    init_cnx_sqlit.creater_tabela_questao()
    init_cnx_sqlit.creater_tabela_alternativas()
    init_cnx_sqlit.creater_tabela_resposta_usuarios()
    init_cnx_sqlit.creater_tabela_usuarios()