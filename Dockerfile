FROM node:22-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]