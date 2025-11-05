#!/bin/bash

# 🚀 Production Deployment Script for E-commerce Admin
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e  # Exit on any error

ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.prod.yml"

echo "🚀 Deploying E-commerce Admin Application to $ENVIRONMENT..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install docker-compose first."
    exit 1
fi

# Check if environment file exists
if [ "$ENVIRONMENT" = "production" ] && [ ! -f ".env.production" ]; then
    print_warning ".env.production not found. Using .env.local"
    if [ ! -f ".env.local" ]; then
        print_error "No environment file found. Please create .env.local or .env.production"
        exit 1
    fi
fi

# Load environment variables
if [ -f ".env.production" ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
    print_status "Loaded production environment variables"
elif [ -f ".env.local" ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
    print_status "Loaded local environment variables"
fi

# Check required environment variables
required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required environment variable $var is not set"
        exit 1
    fi
done

print_status "Environment variables validated ✓"

# Create secrets directory if it doesn't exist
if [ ! -d "secrets" ]; then
    print_status "Creating secrets directory..."
    mkdir -p secrets
    
    # Create placeholder secret files if they don't exist
    if [ ! -f "secrets/openai_api_key.txt" ]; then
        echo "${OPENAI_API_KEY:-placeholder}" > secrets/openai_api_key.txt
    fi
    if [ ! -f "secrets/cloudinary_api_key.txt" ]; then
        echo "${CLOUDINARY_API_KEY:-placeholder}" > secrets/cloudinary_api_key.txt
    fi
    if [ ! -f "secrets/cloudinary_api_secret.txt" ]; then
        echo "${CLOUDINARY_API_SECRET:-placeholder}" > secrets/cloudinary_api_secret.txt
    fi
    
    # Secure the secrets
    chmod 600 secrets/*
    print_status "Secrets directory created and secured"
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down || true

# Pull latest images (if using external images)
print_status "Pulling latest base images..."
docker-compose -f $COMPOSE_FILE pull --ignore-pull-failures || true

# Build and start containers
print_status "Building and starting containers..."
docker-compose -f $COMPOSE_FILE up -d --build

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Check if services are running
print_status "Checking service status..."
docker-compose -f $COMPOSE_FILE ps

# Test health endpoint
print_status "Testing health endpoint..."
for i in {1..10}; do
    if curl -f http://localhost/api/health > /dev/null 2>&1; then
        print_success "Health check passed ✓"
        break
    elif [ $i -eq 10 ]; then
        print_error "Health check failed after 10 attempts"
        print_status "Container logs:"
        docker-compose -f $COMPOSE_FILE logs --tail 20
        exit 1
    else
        print_status "Health check attempt $i/10 failed, retrying..."
        sleep 5
    fi
done

# Test main application
print_status "Testing main application..."
if curl -f http://localhost > /dev/null 2>&1; then
    print_success "Main application is responding ✓"
else
    print_warning "Main application health check failed"
fi

# Display running containers
print_status "Deployment status:"
docker-compose -f $COMPOSE_FILE ps

# Display useful information
print_success "🎉 Deployment completed successfully!"
echo ""
echo "📱 Application URLs:"
echo "   - Main App: http://localhost"
echo "   - Health Check: http://localhost/api/health"
echo "   - API Endpoints: http://localhost/api/*"
echo ""
echo "🔧 Management Commands:"
echo "   - View logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "   - Stop services: docker-compose -f $COMPOSE_FILE down"
echo "   - Restart services: docker-compose -f $COMPOSE_FILE restart"
echo ""
echo "📊 Monitor resources: docker stats"
echo ""

# Optional: Open browser (uncomment if running on desktop)
# if command -v xdg-open &> /dev/null; then
#     xdg-open http://localhost
# fi

exit 0