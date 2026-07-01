# ============================================
# Stage 1: Base (sistema comum)
# ============================================
FROM node:22-slim AS base

RUN apt-get update && apt-get install -y \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ============================================
# Stage 2: Dependencies
# ============================================
FROM base AS deps

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# ============================================
# Stage 3: Development (hot-reload)
# ============================================
FROM base AS dev

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

COPY . .

ARG PORT=8000
EXPOSE $PORT

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

# ============================================
# Stage 4: Production
# ============================================
FROM base AS production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma

COPY . .

ARG PORT=8000
EXPOSE $PORT

ENTRYPOINT ["sh", "docker-entrypoint.sh"]
CMD ["node", "index.js"]
