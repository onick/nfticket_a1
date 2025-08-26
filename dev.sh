#!/bin/bash

# Quick development start script
# This script starts the essential services for development

echo "🚀 Starting TIX Development..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "⚠️  Please configure your .env file before continuing"
    exit 1
fi

# Start databases in background
echo "🗄️  Starting databases..."
docker-compose up -d postgres redis

# Wait for databases
echo "⏳ Waiting for databases..."
sleep 5

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Generate Prisma client
echo "🔧 Setting up database..."
cd packages/database
pnpm prisma generate
pnpm prisma db push
cd ../..

# Start development servers
echo "🚀 Starting servers..."
echo "  💻 Web: http://localhost:3000"
echo "  🔗 API: http://localhost:4000"

# Run in parallel
pnpm run dev &

wait