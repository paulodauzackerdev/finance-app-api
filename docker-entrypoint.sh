#!/bin/sh
set -e

echo "========================================"
echo "  Finance App API - Entrypoint"
echo "========================================"

echo "=> Rodando migrations..."
npx prisma migrate deploy

if [ "$NODE_ENV" = "development" ] || [ "$NODE_ENV" = "staging" ]; then
  echo "=> Rodando seed..."
  node prisma/seed.js
fi

echo "=> Iniciando a aplicação..."
exec "$@"
