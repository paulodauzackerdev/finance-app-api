#!/bin/sh
set -e

echo "========================================"
echo "  Finance App API - Entrypoint"
echo "========================================"

echo "=> Rodando migrations..."
npx prisma migrate deploy

echo "=> Rodando seed..."
node prisma/seed.js

echo "=> Iniciando a aplicação..."
exec "$@"
