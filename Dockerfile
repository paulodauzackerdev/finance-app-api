# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:22-slim AS deps

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

# ============================================
# Stage 2: Development (hot-reload)
# ============================================
FROM node:22-slim AS dev

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

COPY . .

EXPOSE 8000

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

# ============================================
# Stage 3: Production
# ============================================
FROM node:22-slim AS production

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

COPY . .

EXPOSE 8000

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
CMD ["node", "index.js"]
