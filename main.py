import os
from flask import Flask

app = Flask(__name__)

# Define a porta que o Cloud Run espera (8080)
# Cloud Run injeta a porta via variável de ambiente 'PORT'
PORT = int(os.environ.get("PORT", 8080))

@app.route('/')
def hello_world():
    return 'Arquitetura Prime Backend Online! Deploy 100% Sucesso!'

if __name__ == '__main__':
    # O Flask deve escutar em 0.0.0.0 para ser acessível externamente
    app.run(debug=True, host='0.0.0.0', port=PORT)
