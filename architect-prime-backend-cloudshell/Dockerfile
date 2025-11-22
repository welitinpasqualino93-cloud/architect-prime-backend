# Usa uma imagem Node.js base leve
FROM node:18-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências do Node.js
RUN npm install --omit=dev

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
