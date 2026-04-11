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
            CREATE TABLE CATEGORIAS
            (id int PRIMARY KEY,
            categoria TEXT, 
            descricao TEXT                      
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_perguntas(self):
        pass

    def creater_tabela_pontuacao(self):
        pass

    def creater_tabela_classificacao_result(self):
        pass

if __name__ == '__main__':
    init_cnx_sqlit = BaseDadosQuestionarios()
    init_cnx_sqlit.conexao_banco_sqlife()
    init_cnx_sqlit.creater_tabela_categorias()