#!/bin/zsh

set -e

echo "Starting PostgreSQL Docker container..."
if [ "$(docker ps -aq -f name=inventory-db)" ]; then
    echo "Container already exists. Removing..."
    docker rm -f inventory-db
fi

docker run -d \
  --name inventory-db \
  -e POSTGRES_USER=inventory \
  -e POSTGRES_PASSWORD=inventory \
  -e POSTGRES_DB=inventory \
  -p 5432:5432 \
  postgres:15

echo "Waiting for PostgreSQL to be ready..."
sleep 10  

echo "Installing Node.js dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Resetting database, applying migrations, and seeding..."
npx prisma migrate reset --force

echo "Starting development server..."
npm run dev
