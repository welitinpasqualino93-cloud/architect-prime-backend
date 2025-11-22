import os
import sqlalchemy
from flask import Flask, jsonify

app = Flask(__name__)

def connect_tcp_socket():
    # Configurações do Banco de Dados via Variáveis de Ambiente
    db_user = os.environ.get("DB_USER", "postgres")
    db_pass = os.environ.get("DB_PASS", "")
    db_name = os.environ.get("DB_NAME", "postgres")
    db_host = os.environ.get("INSTANCE_HOST", "10.10.0.3")
    
    # Cria o pool de conexão usando o IP privado
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
        # Em caso de falha (esperado localmente), retorna a mensagem de erro detalhada
        return f"Erro ao conectar no banco: {e}"

@app.route("/health")
def health():
    # Mantemos o health check separado
    return jsonify({"status": "ok"}), 200
    
@app.route("/users")
def list_users():
    # Por enquanto, retorna a lista vazia
    return jsonify({"users": []}), 200

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 8080))
    app.run(host='0.0.0.0', port=port)
