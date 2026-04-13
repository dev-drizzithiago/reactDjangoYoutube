import sqlite3
import pandas as pd


class BaseDadosQuestionarios:
    def __init__(self):
        self.conn_sql = None
        self.cursor = None

    def conexao_banco_sqlife(self):

        self.conn_sql = sqlite3.connect(database='questionarios')
        self.cursor = self.conn_sql.cursor()

        return self.conn_sql

    def creater_tabela_categorias(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS categorias
            (
                id INTEGER PRIMARY KEY,
                nome TEXT,             
                weight FLOAT
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_questao(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS perguntas
            (
                id INTEGER PRIMARY KEY,
                questao TEXT, 
                weight FLOAT,
                categoria_id INTEGER, 
                FOREIGN KEY(categoria_id) REFERENCES categorias(id)
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_alternativas(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS alternativas
            (
                id INTEGER PRIMARY KEY,
                nivel TEXT,
                descricao TEXT,
                pontuacao INT,
                pergunta_id INTEGER,
                FOREIGN KEY(pergunta_id) REFERENCES perguntas(id)
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_resposta_usuarios(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS resposta_usuario
            (
                id INTEGER PRIMARY KEY,
                alternatica_id INTEGER,
                FOREIGN KEY(alternatica_id) REFERENCES alternativas(id)
            );
        """
        self.cursor.execute(comando_sql)

    def creater_tabela_usuarios(self):
        comando_sql = """
            CREATE TABLE IF NOT EXISTS cadastro_usuario
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
        self.cursor_insert = self.conn_base_questionario.cursor()

    def insert_dados(self, lista_dados_inset):

        for key, value in lista_dados_inset.items():

            for item in value:

                # Categorias
                comando_sql = rf"""
                    INSERT INTO categorias
                    (nome, weight) 
                    VALUES (?, ?)
                """
                self.cursor_insert.execute(comando_sql, (
                        item['nome'],
                        '10'
                    ))

                categoria_id = self.cursor_insert.lastrowid

                for item_questao in item['perguntas']:

                    comando_sql = rf"""
                        INSERT INTO perguntas
                        (questao, weight, categoria_id)
                        VALUES (?, ?, ?)                        
                    """

                    self.cursor_insert.execute(comando_sql,(
                            item_questao['texto'],
                            10,
                            categoria_id
                        ))
                    pergunta_id = self.cursor_insert.lastrowid

                    for item_alternativa in item_questao['alternativas']:

                        comando_sql = rf"""
                            INSERT INTO alternativas
                            (nivel, pontuacao, descricao, pergunta_id)
                            VALUES (?, ?, ?, ?)                             
                        """
                        self.cursor_insert.execute(comando_sql, (
                                item_alternativa['nivel'],
                                item_alternativa['pontuacao'],
                                item_alternativa['descricao'],
                                pergunta_id
                            ))

        self.conn_base_questionario.commit()


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
            conn_base = init_cnx_sqlit.conexao_banco_sqlife()

            init_insert = InsertIntoQuestionarios(conn_base)

            dados_json = pd.read_json('questionario_maturidade_completo.json')

            init_insert.insert_dados(dados_json)


            # lista_categorias = [
            #     {'nome': 'Conhecimento da Legislação', 'weight': '7'},
            #     {'nome': 'Sistemas (ERP e Tecnologia Fiscal)', 'weight': '10'},
            #     {'nome': 'Compras e Contratação de Fornecedores', 'weight': '10'},
            #     {'nome': 'Cadastro de Produtos e Serviços', 'weight': '10'},
            #     {'nome': 'Estrutura Organizacional / Setores Envolvidos', 'weight': '10'},
            #     {'nome': 'Formação de Preços', 'weight': '5'},
            #     {'nome': 'Estratégia de Implantação', 'weight': '5'},
            # ]
            #
            #
            # lista_alternativas = [
            #
            #     # Conhecimento da Legislação
            #     #"Como sua empresa acompanha mudanças na legislação fiscal?"
            #     {"nivel": "Inexistente", "pontuacao": 0, "descricao": "Não acompanha", "pergunta_id": '1'},
            #     {"nivel": "Inicial", "pontuacao": 1, "descricao": "Apenas quando há impacto direto percebido", "pergunta_id": '1'},
            #     {"nivel": "Intermediário", "pontuacao": 3, "descricao": "Possui equipe que monitora regularmente", "pergunta_id": '1'},
            #     {"nivel": "Avançado", "pontuacao": 5, "descricao": "Usa sistemas automatizados e consultorias especializadas", "pergunta_id": '1'},
            #
            #     # "Há treinamentos sobre legislação para colaboradores?",
            #     {"nivel": "Inexistente", "pontuacao": 0, "descricao": "Não existem"},
            #     {"nivel": "Inicial", "pontuacao": 1, "descricao": "Ocasionalmente, sem padrão"},
            #     {"nivel": "Intermediário", "pontuacao": 3, "descricao": "Treinamentos periódicos para áreas-chave"},
            #     {"nivel": "Avançado", "pontuacao": 5, "descricao": "Programa contínuo e estruturado para toda a organização"},
            #
            #     # "Como são tratadas dúvidas sobre legislação fiscal?",
            #     {"nivel": "Inexistente", "pontuacao": 0, "descricao": "Não há suporte"},
            #     {"nivel": "Inicial", "pontuacao": 1, "descricao": "Consultas informais entre colegas"},
            #     {"nivel": "Intermediário", "pontuacao": 3, "descricao": "Consultoria externa quando necessário"},
            #     {"nivel": "Avançado", "pontuacao": 5, "descricao": "Equipe interna especializada com suporte contínuo"},
            #
            #     # "Existe política formal de compliance fiscal?",
            #     {"nivel": "Inexistente", "pontuacao": 0, "descricao": "Não existe"},
            #     {"nivel": "Inicial", "pontuacao": 1, "descricao": "Apenas em documentos isolados"},
            #     {"nivel": "Intermediário", "pontuacao": 3, "descricao": "Política definida e aplicada em áreas críticas"},
            #     {"nivel": "Avançado", "pontuacao": 5, "descricao": "Política integrada e auditada regularmente"},
            #
            #     # "Como é feita a atualização de processos frente a novas leis?",
            #     {"nivel": "Inexistente", "pontuacao": 0, "descricao": "Não há atualização"},
            #     {"nivel": "Inicial", "pontuacao": 1, "descricao": "Atualização reativa e lenta"},
            #     {"nivel": "Intermediário", "pontuacao": 3, "descricao": "Atualização planejada com cronograma"},
            #     {"nivel": "Avançado", "pontuacao": 5, "descricao": "Atualização imediata com processos automatizados"},
            #
            #     # ERP e Tecnologia Fiscal
            #     # Qual o nível de integração do ERP com obrigações fiscais?
            #     {"nivel": '', "pontuação": "", "descricao": "Não há integração", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Integração parcial e manual", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Integração automatizada para principais obrigações", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Integração completa e em tempo real", "pergunta_id": ""},
            #
            #     # Como são gerados relatórios fiscais?
            #     {"nivel": '', "pontuação": "", "descricao": "Manualmente em planilhas", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Relatórios básicos no ERP", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Relatórios automatizados e customizáveis", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Relatórios inteligentes com análise preditiva", "pergunta_id": ""},
            #
            #     # Existe monitoramento de erros fiscais no sistema?
            #     {"nivel": '', "pontuação": "", "descricao": "Não existe", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Apenas quando identificados manualmente", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Alertas automáticos em casos críticos", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Monitoramento contínuo com dashboards", "pergunta_id": ""},
            #
            #     # O ERP é atualizado conforme mudanças fiscais?
            #     {"nivel": '', "pontuação": "", "descricao": "Não é atualizado", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Atualizado apenas quando há falhas", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Atualizado regularmente por fornecedor", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Atualizado automaticamente com suporte proativo", "pergunta_id": ""},
            #
            #     # Como é feita a integração com órgãos reguladores?
            #     {"nivel": '', "pontuação": "", "descricao": "Não há integração", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Envio manual de informações", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Integração parcial com sistemas oficiais", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Integração completa e automatizada", "pergunta_id": ""},
            #
            #     # Compras e Fornecedores
            #     # Como é feita a avaliação de fornecedores?
            #     {"nivel": '', "pontuação": "", "descricao": "Não há avaliação", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Avaliação básica de preço", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Avaliação de critérios técnicos e fiscais", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "Avaliação contínua com indicadores de desempenho", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            #     {"nivel": '', "pontuação": "", "descricao": "", "pergunta_id": ""},
            # ]

