#!/bin/bash

# TIX Development Setup Script
# This script sets up the entire TIX development environment

set -e

echo "🚀 Setting up TIX 2.0 Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_requirements() {
    echo -e "${BLUE}📋 Checking requirements...${NC}"
    
    command -v node >/dev/null 2>&1 || { 
        echo -e "${RED}❌ Node.js is required but not installed.${NC}" >&2
        exit 1
    }
    
    command -v pnpm >/dev/null 2>&1 || { 
        echo -e "${YELLOW}⚠️  pnpm not found. Installing...${NC}"
        npm install -g pnpm
    }
    
    command -v docker >/dev/null 2>&1 || { 
        echo -e "${RED}❌ Docker is required but not installed.${NC}" >&2
        exit 1
    }
    
    echo -e "${GREEN}✅ All requirements satisfied${NC}"
}

# Install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    pnpm install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
}

# Setup environment variables
setup_env() {
    echo -e "${BLUE}⚙️  Setting up environment variables...${NC}"
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${YELLOW}📝 Created .env file from .env.example${NC}"
        echo -e "${YELLOW}⚠️  Please update .env with your actual configuration${NC}"
    else
        echo -e "${GREEN}✅ .env file already exists${NC}"
    fi
}

# Start databases with Docker
start_databases() {
    echo -e "${BLUE}🗄️  Starting databases with Docker...${NC}"
    
    docker-compose up -d postgres redis elasticsearch
    
    # Wait for databases to be ready
    echo -e "${YELLOW}⏳ Waiting for databases to be ready...${NC}"
    sleep 10
    
    echo -e "${GREEN}✅ Databases started${NC}"
}

# Setup database schema
setup_database() {
    echo -e "${BLUE}🗃️  Setting up database schema...${NC}"
    
    cd packages/database
    pnpm prisma generate
    pnpm prisma db push
    pnpm prisma db seed
    cd ../..
    
    echo -e "${GREEN}✅ Database schema setup complete${NC}"
}

# Generate Prisma client
generate_prisma() {
    echo -e "${BLUE}🔧 Generating Prisma client...${NC}"
    cd packages/database
    pnpm prisma generate
    cd ../..
    echo -e "${GREEN}✅ Prisma client generated${NC}"
}

# Start development servers
start_dev_servers() {
    echo -e "${BLUE}🚀 Starting development servers...${NC}"
    
    # Create a new tmux session or use existing
    if command -v tmux >/dev/null 2>&1; then
        echo -e "${BLUE}📱 Using tmux for multiple servers...${NC}"
        
        # Kill existing session if exists
        tmux kill-session -t tix-dev 2>/dev/null || true
        
        # Create new session
        tmux new-session -d -s tix-dev
        
        # Split windows for different services
        tmux send-keys -t tix-dev:0 'pnpm dev:api' C-m
        tmux split-window -h -t tix-dev:0
        tmux send-keys -t tix-dev:0.1 'sleep 5 && pnpm dev:web' C-m
        tmux split-window -v -t tix-dev:0.1
        tmux send-keys -t tix-dev:0.2 'sleep 10 && pnpm dev:admin' C-m
        
        echo -e "${GREEN}✅ Development servers started in tmux session 'tix-dev'${NC}"
        echo -e "${BLUE}💡 Run 'tmux attach -t tix-dev' to attach to the session${NC}"
        
    else
        echo -e "${YELLOW}⚠️  tmux not found. Starting servers individually...${NC}"
        echo -e "${BLUE}🔗 API Server: http://localhost:4000${NC}"
        echo -e "${BLUE}🌐 Web App: http://localhost:3000${NC}"
        echo -e "${BLUE}⚙️  Admin: http://localhost:3001${NC}"
        
        # Start in background (you might want to use separate terminals)
        pnpm dev:api &
        sleep 5
        pnpm dev:web &
        sleep 5
        pnpm dev:admin &
    fi
}

# Display useful URLs
display_info() {
    echo ""
    echo -e "${GREEN}🎉 TIX Development Environment Ready!${NC}"
    echo ""
    echo -e "${BLUE}📚 Available Services:${NC}"
    echo -e "  🌐 Web App:        http://localhost:3000"
    echo -e "  ⚙️  Admin Panel:    http://localhost:3001"
    echo -e "  🔗 API Gateway:    http://localhost:4000"
    echo -e "  📖 API Docs:       http://localhost:4000/docs"
    echo -e "  🗄️  Database UI:    http://localhost:5432 (Prisma Studio)"
    echo -e "  📧 Email Testing:  http://localhost:8025 (MailHog)"
    echo -e "  🔍 Elasticsearch:  http://localhost:9200"
    echo ""
    echo -e "${BLUE}🛠️  Useful Commands:${NC}"
    echo -e "  pnpm dev          - Start all services"
    echo -e "  pnpm build        - Build all applications"
    echo -e "  pnpm test         - Run tests"
    echo -e "  pnpm db:studio    - Open Prisma Studio"
    echo -e "  pnpm db:migrate   - Run database migrations"
    echo ""
    echo -e "${YELLOW}📝 Next Steps:${NC}"
    echo -e "  1. Update .env with your API keys"
    echo -e "  2. Configure payment providers (Stripe)"
    echo -e "  3. Setup email service (SendGrid/SMTP)"
    echo -e "  4. Configure media storage (Cloudinary)"
    echo ""
}

# Main execution
main() {
    check_requirements
    install_dependencies
    setup_env
    start_databases
    setup_database
    generate_prisma
    display_info
    
    echo -e "${GREEN}✨ Setup complete! Happy coding! ✨${NC}"
}

# Run main function
main "$@"