import os
import sqlalchemy
from flask import Flask

app = Flask(__name__)

def connect_tcp_socket():
    # Configurações do Banco de Dados via Variáveis de Ambiente
    db_user = os.environ.get("DB_USER", "postgres")
    db_pass = os.environ.get("DB_PASS", "")
    db_name = os.environ.get("DB_NAME", "postgres")
    db_host = os.environ.get("INSTANCE_HOST", "10.10.0.3") # IP do Cloud SQL (vamos verificar)

    # O Cloud Run injeta automaticamente o socket Unix se usarmos o nome da conexão,
    # mas como estamos usando VPC, conectamos via IP Privado.
    # Vamos usar a conexão via TCP/IP usando o conector VPC.

    # Nota: Em produção com VPC, usamos o IP privado da instância.
    # Mas o método mais fácil e compatível com o Cloud Run + Auth Proxy automático
    # é usar o conector Unix Socket, mesmo com VPC, se o Proxy estiver ativo.
    # Para simplificar este teste com VPC puro, vamos tentar conectar via driver direto.

    pool = sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL.create(
            drivername="postgresql+pg8000",
            username=db_user,
            password=db_pass,
            host=db_host, 
            port=5432,
            database=db_name,
        )
    )
    return pool

@app.route('/')
def index():
    try:
        # Tenta conectar
        db = connect_tcp_socket()
        with db.connect() as conn:
            # Executa uma query simples para pegar a hora do servidor
            result = conn.execute(sqlalchemy.text("SELECT NOW()")).fetchone()
            return f"Conexão com Cloud SQL (PostgreSQL) BEM SUCEDIDA! <br> Hora do Banco: {result[0]}"
    except Exception as e:
        return f"Erro ao conectar no banco: {e}"

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
