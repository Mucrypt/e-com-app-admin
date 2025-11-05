# 🚀 E-Commerce Admin Deployment Guide

## 📋 Prerequisites

### Required Software
- **Docker** (v24.0+) & **Docker Compose** (v2.0+)
- **Node.js** (v20+) for local development
- **Git** for version control

### Required Accounts & Services
- **Supabase** account with database setup
- **Cloudinary** account for image management
- **OpenAI** account for AI features
- **Domain** (for production deployment)

---

## 🔧 Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/Mucrypt/e-com-app-admin.git
cd e-com-app-admin
```

### 2. Environment Configuration

#### Create Development Environment File
```bash
cp .env.example .env.local
```

#### Edit `.env.local` with your credentials:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Development
NODE_ENV=development
```

#### Create Production Environment File
```bash
cp .env.example .env.production
```

#### Edit `.env.production` for production:
```bash
# Update NEXT_PUBLIC_SITE_URL for production
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

### 3. Docker Secrets Setup (Production)
```bash
# Create secrets directory
mkdir -p secrets

# Create secret files (replace with actual values)
echo "sk-your-openai-key-here" > secrets/openai_api_key.txt
echo "your_cloudinary_api_key" > secrets/cloudinary_api_key.txt
echo "your_cloudinary_api_secret" > secrets/cloudinary_api_secret.txt

# Secure the secrets
chmod 600 secrets/*
```

---

## 🚀 Quick Start Guide

### 1. First Time Setup
```bash
# Clone and setup
git clone https://github.com/Mucrypt/e-com-app-admin.git
cd e-com-app-admin

# Make scripts executable
chmod +x scripts/*.sh

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your credentials

# Install dependencies
npm install
```

### 2. Development (Choose One Method)

#### Method A: Node.js Development (Recommended)
```bash
# Start development server
npm run dev

# Test the application
./scripts/test.sh health http://localhost:3000
```

#### Method B: Docker Development
```bash
# Start full Docker environment
./scripts/dev.sh start

# Check status
./scripts/dev.sh status

# Run tests
./scripts/test.sh all http://localhost
```

### 3. Production Deployment
```bash
# Deploy to production
./scripts/deploy.sh production

# Run comprehensive tests
./scripts/test.sh all https://yourdomain.com
```

---

## 🤖 Automation Scripts

The project includes several automation scripts in the `scripts/` directory to streamline development and deployment:

### Development Management Script (`dev.sh`)
Comprehensive development environment manager:

```bash
# Start development environment
./scripts/dev.sh start

# Stop development environment
./scripts/dev.sh stop

# Restart development environment
./scripts/dev.sh restart

# Check status of all services
./scripts/dev.sh status

# View logs from all services
./scripts/dev.sh logs

# Clean restart (remove volumes and rebuild)
./scripts/dev.sh clean

# Show help
./scripts/dev.sh help
```

### Deployment Script (`deploy.sh`)
Automated deployment with health checks:

```bash
# Deploy to production
./scripts/deploy.sh production

# Deploy to staging
./scripts/deploy.sh staging

# Deploy to development
./scripts/deploy.sh development

# Deploy with custom environment file
./scripts/deploy.sh production /path/to/.env.prod
```

**Features:**
- Pre-deployment validation
- Automated health checks
- Rollback on failure
- Status monitoring
- Environment verification

### Testing Script (`test.sh`)
Comprehensive testing suite:

```bash
# Run all tests
./scripts/test.sh all

# Run specific test categories
./scripts/test.sh health              # Health checks
./scripts/test.sh api                 # API endpoint tests
./scripts/test.sh pages               # Page accessibility tests
./scripts/test.sh performance         # Performance tests
./scripts/test.sh security            # Security header tests
./scripts/test.sh docker              # Docker container tests

# Test with custom base URL
./scripts/test.sh all http://localhost:3000
./scripts/test.sh pages https://yourdomain.com
```

**Test Categories:**
- **Health Tests**: Basic connectivity and health endpoints
- **API Tests**: All API endpoints and response validation
- **Page Tests**: All footer pages and main application pages
- **Performance Tests**: Response times and concurrent request handling
- **Security Tests**: Security headers and rate limiting
- **Docker Tests**: Container status and inter-service communication

### Windows Batch Scripts
For Windows users, equivalent batch scripts are available:

```batch
# Development commands
scripts\dev.bat          # Start development environment
scripts\build.bat        # Build the application
scripts\deploy.bat       # Deploy to production

# All scripts support the same parameters as their .sh counterparts
```

### Script Permissions
Make sure all scripts are executable:

```bash
chmod +x scripts/*.sh
```

### Script Examples and Use Cases

#### Development Workflow Example
```bash
# Start development environment
./scripts/dev.sh start

# Check if everything is running
./scripts/dev.sh status

# View logs if needed
./scripts/dev.sh logs

# Run tests while developing
./scripts/test.sh api http://localhost

# Clean restart when needed
./scripts/dev.sh clean

# Stop when done
./scripts/dev.sh stop
```

#### Production Deployment Example
```bash
# Pre-deployment checks
./scripts/test.sh all http://localhost:3000

# Deploy to staging first
./scripts/deploy.sh staging

# Test staging environment
./scripts/test.sh all https://staging.yourdomain.com

# Deploy to production
./scripts/deploy.sh production

# Verify production deployment
./scripts/test.sh all https://yourdomain.com
```

#### Testing Examples
```bash
# Quick health check
./scripts/test.sh health

# Test all footer pages
./scripts/test.sh pages

# Performance testing
./scripts/test.sh performance

# Security testing
./scripts/test.sh security

# Full comprehensive test
./scripts/test.sh all
```

#### Docker Management Examples
```bash
# Start Docker development
./scripts/dev.sh start

# Check Docker container status
./scripts/test.sh docker

# View Docker logs
./scripts/dev.sh logs

# Clean Docker environment
./scripts/dev.sh clean
```

---

## 🏠 Local Development

### Method 1: Node.js Development Server (Recommended)

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Alternative development commands
npm run dev:turbo    # Explicit Turbopack
npm run dev:normal   # Standard Next.js dev server
```

**Access Points:**
- App: http://localhost:3000
- API Health: http://localhost:3000/api/health

### Method 2: Docker Development Environment

```bash
# Start all services (app, nginx, redis)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Access Points:**
- App via Nginx: http://localhost
- Direct App: http://localhost:3000
- Redis: localhost:6379

---

## 🏗️ Building for Production

### Build Docker Image
```bash
# Load environment variables and build
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL} \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY} \
  --build-arg NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
  -t ecom-admin:latest .
```

### Test Built Image
```bash
# Run the built image
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  ecom-admin:latest

# Test health endpoint
curl http://localhost:3000/api/health
```

---

## 🚀 Production Deployment

### Method 1: Single Server Deployment

```bash
# Deploy using production compose file
docker-compose -f docker-compose.prod.yml up -d --build

# Monitor deployment
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Method 2: Staging Environment

```bash
# Create staging environment
cp docker-compose.prod.yml docker-compose.staging.yml

# Edit staging file to use different ports/configs
# Then deploy staging
docker-compose -f docker-compose.staging.yml up -d --build
```

---

## 🧪 Testing & Verification

### Health Checks
```bash
# Test application health
curl -f http://localhost/api/health
# Expected: {"status":"healthy","timestamp":"..."}

# Test direct app health (development)
curl -f http://localhost:3000/api/health

# Test with verbose output
curl -v http://localhost/api/health
```

### API Endpoint Testing
```bash
# Test categories API
curl http://localhost/api/categories

# Test products API
curl http://localhost/api/products

# Test banners API
curl http://localhost/api/banners

# Test authenticated endpoints (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost/api/profile
```

### Container Health Checks
```bash
# Check all container statuses
docker-compose ps

# View container health
docker inspect --format='{{.State.Health.Status}}' ecom-admin-app

# Check container logs
docker-compose logs app
docker-compose logs nginx
docker-compose logs redis
```

### Performance Testing
```bash
# Load test with curl (simple)
for i in {1..10}; do
  curl -w "%{time_total}s\n" -o /dev/null -s http://localhost/
done

# Test static asset caching
curl -I http://localhost/_next/static/css/app.css
# Should show cache headers

# Test API rate limiting
for i in {1..15}; do
  curl -I http://localhost/api/products
done
# Should show 429 after limit
```

---

## 🔍 Monitoring & Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f nginx
docker-compose logs -f redis

# Nginx access logs
docker-compose exec nginx tail -f /var/log/nginx/access.log

# Nginx error logs
docker-compose exec nginx tail -f /var/log/nginx/error.log
```

### Container Resource Usage
```bash
# View resource usage
docker stats

# Container details
docker-compose exec app ps aux
docker-compose exec app df -h
```

---

## 🛠️ Maintenance Commands

### Updates & Rebuilds
```bash
# Pull latest code and rebuild
git pull origin main
docker-compose down
docker-compose up -d --build

# Force rebuild (no cache)
docker-compose build --no-cache
```

### Database Operations
```bash
# Access app container for DB operations
docker-compose exec app sh

# Run database migrations (if applicable)
# These would be run from within the app container
```

### Backup & Restore
```bash
# Backup Redis data
docker-compose exec redis redis-cli BGSAVE

# Export Redis data
docker-compose exec redis redis-cli --rdb dump.rdb

# Backup volumes
docker run --rm -v ecom-admin_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup.tar.gz /data
```

---

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :80

# Kill processes
sudo pkill -f "next dev"
sudo pkill -f nginx
```

#### Container Won't Start
```bash
# Check container logs
docker-compose logs app

# Check if environment variables are set
docker-compose exec app env | grep -E "(SUPABASE|CLOUDINARY|OPENAI)"

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

#### Nginx Configuration Issues
```bash
# Test nginx config
docker-compose exec nginx nginx -t

# Reload nginx
docker-compose exec nginx nginx -s reload

# Check nginx status
docker-compose exec nginx nginx -s status
```

#### Database Connection Issues
```bash
# Test Supabase connection from container
docker-compose exec app curl -I "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/"

# Check environment variables
docker-compose exec app echo $NEXT_PUBLIC_SUPABASE_URL
```

### Debug Mode
```bash
# Run in debug mode
docker-compose -f docker-compose.yml -f docker-compose.debug.yml up -d

# Access container shell
docker-compose exec app sh

# Check file permissions
docker-compose exec app ls -la /app
```

---

## 📊 Performance Optimization

### Docker Optimizations
```bash
# Clean up unused images
docker image prune -a

# Clean up unused volumes
docker volume prune

# Clean up unused networks
docker network prune

# Complete cleanup
docker system prune -a --volumes
```

### Application Optimizations
```bash
# Build with optimization flags
NEXT_TELEMETRY_DISABLED=1 npm run build

# Check bundle size
npx @next/bundle-analyzer
```

---

## 🔐 Security Checklist

### Before Production Deployment

1. **Environment Variables**
   - [ ] All sensitive data in secrets files
   - [ ] No hardcoded credentials in code
   - [ ] Production URLs configured

2. **Docker Security**
   - [ ] Using non-root user (distroless image)
   - [ ] Read-only filesystem where possible
   - [ ] Security headers configured in Nginx

3. **Network Security**
   - [ ] Rate limiting configured
   - [ ] CORS properly configured
   - [ ] SSL/TLS certificates installed

4. **Application Security**
   - [ ] Authentication working
   - [ ] Authorization rules in place
   - [ ] Input validation enabled

---

## 📚 Additional Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Docker Documentation**: https://docs.docker.com/
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Supabase Documentation**: https://supabase.com/docs

---

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review container logs
3. Verify environment variables
4. Test individual components
5. Check network connectivity

For additional help, create an issue in the repository with:
- Error messages
- Container logs
- Environment details
- Steps to reproduce