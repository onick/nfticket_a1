#!/bin/bash

echo "🎫 TIX 2.0 - Installation Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18.0+ first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be 18.0 or higher. Current: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}⚠️  pnpm not found. Installing pnpm...${NC}"
    npm install -g pnpm
fi

echo -e "${GREEN}✅ pnpm $(pnpm -v) ready${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
pnpm install

# Copy environment files if they don't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating root .env file...${NC}"
    cp .env.example .env
fi

if [ ! -f "apps/api/.env" ]; then
    echo -e "${YELLOW}📝 Creating API .env file...${NC}"
    cp apps/api/.env.example apps/api/.env
fi

if [ ! -f "apps/web/.env" ]; then
    echo -e "${YELLOW}📝 Creating Web .env file...${NC}"
    cp apps/web/.env.example apps/web/.env
fi

echo ""
echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Configure your environment variables in .env files"
echo "2. Start MongoDB: docker-compose up -d mongodb redis"
echo "3. Run the application: pnpm dev"
echo ""
echo -e "${BLUE}🌐 Application URLs:${NC}"
echo "• Frontend: http://localhost:3000"
echo "• API: http://localhost:4000"
echo "• API Docs: http://localhost:4000/docs"
echo ""
echo -e "${YELLOW}💡 For quick setup, run: ./quick-start.sh${NC}"
