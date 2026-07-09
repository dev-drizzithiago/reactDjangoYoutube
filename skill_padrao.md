markdown
# Skill: Sistema Padronizado Django + React + MySQL

## 🎯 Objetivo
Padronizar todos os projetos com:
- **Backend:** Django + MySQL
- **Frontend:** React com paleta de cores leves e nítidas
- **Ícones:** padrão [React Icons](https://react-icons.github.io/react-icons/)
- **Backup/Restore:** suporte a exportação/importação em SQL e JSON

---

## ⚛️ Frontend React

- Paleta de cores leves e nítidas (ex.: tons pastel, azul claro, verde suave).
- Uso de **React Icons** para padronizar ícones em toda a interface.
- Integração com API Django via **Axios** ou **React Query**.
- Estrutura de componentes reutilizáveis para escalabilidade.

---

## 🐍 Backend Django

- Banco de dados: **MySQL**.
- API REST com **Django REST Framework**.
- Endpoints para:
  - Gerenciamento de recursos.
  - Backup e restauração do banco.

### Exemplo de Backup SQL
```python
import subprocess

def backup_sql():
    subprocess.run([
        "mysqldump",
        "-u", "usuario",
        "-p'senha'",
        "nome_banco",
        ">", "backup.sql"
    ], shell=True)
Exemplo de Backup JSON
python
import json
from django.core.serializers import serialize
from django.apps import apps

def backup_json():
    data = {}
    for model in apps.get_models():
        data[model.__name__] = json.loads(serialize("json", model.objects.all()))
    with open("backup.json", "w") as f:
        json.dump(data, f, indent=4)
Restauração
SQL: mysql -u usuario -p nome_banco < backup.sql

JSON: ler arquivo e recriar objetos via ORM.

🚀 Escalabilidade
Docker Compose para orquestrar Django, React e MySQL.

CI/CD para deploy automatizado.

Monitoramento com Prometheus + Grafana.

Redis opcional para cache.

📦 Fluxo Completo
Usuário acessa React → interface leve e clara.

React consome API Django.

Django processa dados no MySQL.

Sistema permite backup/restauração em SQL ou JSON.

Ícones padronizados garantem consistência visual.

🔒 Segurança
Configurar roles e permissões no Django.

Usar HTTPS em toda comunicação.

Armazenar backups em local seguro (ex.: S3, Azure Blob).

📌 Próximos Passos
Criar docker-compose.yml com Django, React e MySQL.

Implementar endpoints REST para backup/restore.

Definir paleta de cores padrão em theme.js no React.

Código

---

Esse `.md` já serve como **template de skill** para o Claude gerar seus projetos sempre com essa base.  

Quer que eu já monte o **docker-compose.yml** correspondente (Django + React + MySQL + Redis opcional), para complementar essa documentação e deixar pronto para rodar?