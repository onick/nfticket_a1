#!/bin/bash

# TIX 2.0 Quick Start Script
# This starts MongoDB locally and initializes the development environment

echo "🚀 TIX 2.0 - Quick Development Start"
echo "=================================="

# Kill any existing MongoDB process
echo "🛑 Stopping any existing MongoDB..."
killall mongod 2>/dev/null || true

# Start MongoDB locally (without Docker)
echo "🗄️ Starting MongoDB locally..."
if command -v mongod &> /dev/null; then
    # Create data directory if it doesn't exist
    mkdir -p ./data/db
    mongod --dbpath ./data/db --fork --logpath ./data/mongodb.log --quiet
    echo "✅ MongoDB started successfully"
else
    echo "❌ MongoDB not found. Please install MongoDB:"
    echo "   brew install mongodb-community"
    exit 1
fi

# Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to be ready..."
sleep 3

# Install dependencies
echo "📦 Installing dependencies..."
cd apps/api && npm install && cd ../..

# Initialize database with sample data
echo "🌱 Initializing database..."
cd apps/api && node ../../setup-dev.js && cd ../..

# Start the API server
echo "🚀 Starting API server..."
cd apps/api && npm run dev &
API_PID=$!

# Start the web frontend 
echo "🌐 Starting web frontend..."
cd apps/web && npm install && npm run dev &
WEB_PID=$!

echo ""
echo "🎉 TIX Development Environment Ready!"
echo "=================================="
echo "📱 Frontend: http://localhost:3000"
echo "🔗 API: http://localhost:4000"
echo "🗄️ MongoDB: mongodb://localhost:27017/tix_dev"
echo ""
echo "📧 Test accounts:"
echo "   Organizer: organizador@tix.com | Pass: 123456789"
echo "   User: usuario@tix.com | Pass: 123456789"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap 'echo "🛑 Stopping services..."; kill $API_PID $WEB_PID 2>/dev/null; killall mongod 2>/dev/null; exit' INT
wait