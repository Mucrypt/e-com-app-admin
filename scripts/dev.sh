#!/bin/bash

# 🚀 Development Environment Setup Script
# Usage: ./dev.sh [command]
# Commands: start, stop, restart, logs, clean

set -e

COMMAND=${1:-start}

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to start development environment
start_dev() {
    print_status "🚀 Starting Development Environment..."

    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Creating from example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env.local
            print_warning "Please edit .env.local with your actual configuration"
        else
            print_error ".env.example not found. Please create .env.local manually"
            exit 1
        fi
    fi

    # Check for port conflicts
    if check_port 3000; then
        print_warning "Port 3000 is already in use"
        print_status "Finding process using port 3000:"
        lsof -i :3000 || true
    fi

    if check_port 80; then
        print_warning "Port 80 is already in use"
        print_status "Finding process using port 80:"
        lsof -i :80 || true
    fi

    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi

    # Start Docker development environment
    print_status "Starting Docker containers..."
    docker-compose up -d

    # Wait for services
    print_status "⏳ Waiting for services to start..."
    sleep 20

    # Check service status
    print_status "Checking service status..."
    docker-compose ps

    # Test services
    print_status "Testing services..."
    
    # Test Redis
    if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
        print_success "Redis is running ✓"
    else
        print_warning "Redis health check failed"
    fi

    # Test App
    for i in {1..10}; do
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            print_success "App is running ✓"
            break
        elif [ $i -eq 10 ]; then
            print_warning "App health check failed"
        else
            sleep 2
        fi
    done

    # Test Nginx
    for i in {1..5}; do
        if curl -f http://localhost/api/health > /dev/null 2>&1; then
            print_success "Nginx is running ✓"
            break
        elif [ $i -eq 5 ]; then
            print_warning "Nginx health check failed"
        else
            sleep 2
        fi
    done

    print_success "✅ Development environment started!"
    echo ""
    echo "📱 Available URLs:"
    echo "   - App (Direct): http://localhost:3000"
    echo "   - App (via Nginx): http://localhost"
    echo "   - Health Check: http://localhost:3000/api/health"
    echo ""
    echo "🔧 Useful Commands:"
    echo "   - View logs: ./scripts/dev.sh logs"
    echo "   - Restart: ./scripts/dev.sh restart"
    echo "   - Stop: ./scripts/dev.sh stop"
    echo "   - Clean: ./scripts/dev.sh clean"
    echo ""
    echo "🗄️ Services:"
    echo "   - Redis: localhost:6379"
    echo "   - PostgreSQL: Supabase (external)"
    echo ""
}

# Function to stop development environment
stop_dev() {
    print_status "Stopping development environment..."
    docker-compose down
    
    # Kill any remaining Next.js processes
    pkill -f "next dev" || true
    
    print_success "Development environment stopped"
}

# Function to restart development environment
restart_dev() {
    print_status "Restarting development environment..."
    stop_dev
    sleep 5
    start_dev
}

# Function to show logs
show_logs() {
    local service=${2:-""}
    if [ -n "$service" ]; then
        print_status "Showing logs for $service..."
        docker-compose logs -f "$service"
    else
        print_status "Showing logs for all services..."
        docker-compose logs -f
    fi
}

# Function to clean development environment
clean_dev() {
    print_status "Cleaning development environment..."
    
    # Stop containers
    docker-compose down -v
    
    # Remove images
    docker-compose down --rmi all
    
    # Clean Docker system
    docker system prune -f
    
    # Remove node_modules (optional)
    read -p "Remove node_modules? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf node_modules
        print_status "node_modules removed"
    fi
    
    # Remove .next directory
    if [ -d ".next" ]; then
        rm -rf .next
        print_status ".next directory removed"
    fi
    
    print_success "Development environment cleaned"
}

# Function to run development server without Docker
dev_server() {
    print_status "Starting Next.js development server..."
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
    fi
    
    # Check if .env.local exists
    if [ ! -f ".env.local" ]; then
        print_warning ".env.local not found. Please create it from .env.example"
        exit 1
    fi
    
    # Start development server
    npm run dev
}

# Function to show status
show_status() {
    print_status "Development environment status:"
    echo ""
    
    # Docker containers
    echo "🐳 Docker Containers:"
    docker-compose ps
    echo ""
    
    # Port usage
    echo "🔌 Port Usage:"
    echo "Port 3000: $(if check_port 3000; then echo "IN USE"; else echo "FREE"; fi)"
    echo "Port 80: $(if check_port 80; then echo "IN USE"; else echo "FREE"; fi)"
    echo "Port 6379: $(if check_port 6379; then echo "IN USE"; else echo "FREE"; fi)"
    echo ""
    
    # Docker stats
    echo "📊 Resource Usage:"
    docker stats --no-stream || echo "No containers running"
}

# Main command processing
case $COMMAND in
    "start")
        start_dev
        ;;
    "stop")
        stop_dev
        ;;
    "restart")
        restart_dev
        ;;
    "logs")
        show_logs "$@"
        ;;
    "clean")
        clean_dev
        ;;
    "server")
        dev_server
        ;;
    "status")
        show_status
        ;;
    *)
        echo "🚀 Development Environment Manager"
        echo ""
        echo "Usage: ./scripts/dev.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start   - Start development environment (default)"
        echo "  stop    - Stop development environment"
        echo "  restart - Restart development environment"
        echo "  logs    - Show container logs"
        echo "  clean   - Clean development environment"
        echo "  server  - Start Next.js dev server (no Docker)"
        echo "  status  - Show environment status"
        echo ""
        echo "Examples:"
        echo "  ./scripts/dev.sh start"
        echo "  ./scripts/dev.sh logs app"
        echo "  ./scripts/dev.sh clean"
        ;;
esac