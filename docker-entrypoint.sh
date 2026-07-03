#!/bin/sh
set -e

# Só roda setup se for iniciar o servidor (npm run dev ou node index.js)
case "$@" in
  *"node index.js"*|*"npm run dev"*|*"npm start"*)
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
    ;;
esac

exec "$@"
