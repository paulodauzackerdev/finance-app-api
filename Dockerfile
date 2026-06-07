FROM node:24-alpine

# Instala ferramentas úteis (opcional)
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    bash \
    curl \
    git

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependências
RUN npm ci
# Copia o resto do código
COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]