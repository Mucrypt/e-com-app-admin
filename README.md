# E-Com App Admin

A modern, full-stack admin dashboard for managing your e-commerce platform. Built with Next.js, React, Supabase, and TypeScript, this app provides robust authentication, intuitive UI, and seamless integration with your shop backend.

---

## 🚀 Features

- **Authentication**: Secure login, registration, Google OAuth, password visibility toggle, and robust session management.
- **Role-Based Access**: Superadmin, admin, and public views for granular control.
- **Product & Category Management**: Add, edit, and organize products and categories with ease.
- **Order Tracking**: View and manage orders, order items, and customer details.
- **User Management**: Manage users, roles, and permissions.
- **Responsive UI**: Beautiful, mobile-friendly design with custom components and icons.
- **Supabase Integration**: Real-time database, authentication, and API connectivity.
- **Custom Hooks & Middleware**: Centralized logic for authentication, categories, and route protection.
- **Robust Logout**: Ensures all session cookies are cleared for security.
- **Loading & Error States**: User-friendly feedback with spinners and toast notifications.
- **Docker Deployment**: Production-ready containerization with Nginx reverse proxy.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Framer Motion, Lucide Icons
- **Backend**: Supabase (auth, database)
- **Styling**: CSS Modules, PostCSS
- **Deployment**: Docker, Nginx, Redis
- **Linting**: ESLint, Zod for schema validation

---

## 📁 Project Structure

```bash
├── public/                # Static assets (SVGs, images, favicon)
├── src/
│   ├── actions/           # Server actions (auth, etc.)
│   ├── app/               # Next.js app directory
│   │   ├── Authentication # Auth pages (login, signup)
│   │   ├── profile/       # User profile page
│   │   ├── superadmin/    # Superadmin dashboard
│   │   ├── admin/         # Admin dashboard
│   │   ├── public/        # Public pages
│   │   ├── api/           # API routes
│   ├── components/        # Reusable UI components
│   ├── constants/         # App-wide constants
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── providers/         # Context providers (theme, etc.)
│   ├── styles/            # CSS modules
│   ├── supabase/          # Supabase client, types, middleware
│   ├── types/             # TypeScript types
├── nginx/                 # Nginx configuration
├── scripts/               # Deployment scripts
├── .env.local             # Environment variables
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Development compose
├── docker-compose.prod.yml # Production compose
└── DEPLOYMENT.md          # Deployment guide
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+ installed
- Docker Desktop installed and running
- Git installed

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd e-com-app-admin

# Install dependencies
npm install

# Configure environment variables
# Copy .env.local.example to .env.local and fill in your credentials
```

### 2. Development Testing

```bash
# Test 1: Basic Next.js Development
npm run dev
# Visit: http://localhost:3000
# Test health endpoint: http://localhost:3000/api/health

# Test 2: Build Check
npm run build
npm start
```

### 3. Docker Testing

```bash
# Test 3: Docker Build
docker build -t ecom-admin:test .

# Test 4: Docker Run (single container)
docker run -p 3000:3000 --env-file .env.local ecom-admin:test
# Visit: http://localhost:3000

# Test 5: Stop single container
docker stop $(docker ps -q --filter ancestor=ecom-admin:test)
```

### 4. Docker Compose Testing

```bash
# Test 6: Development Compose
docker-compose up --build
# Visit: http://localhost (Nginx)
# Visit: http://localhost:3000 (Direct app)
# Health check: http://localhost/api/health

# Test 7: View logs
docker-compose logs -f app
docker-compose logs -f nginx

# Test 8: Stop development
docker-compose down
```

### 5. Production Testing

```bash
# Test 9: Production Build
docker-compose -f docker-compose.prod.yml build

# Test 10: Production Deployment
docker-compose -f docker-compose.prod.yml up -d
# Visit: http://localhost

# Test 11: Health Check
curl http://localhost/api/health

# Test 12: Performance Check
docker stats
```

### 6. Advanced Testing

```bash
# Test 13: Redis Connection
docker-compose exec redis redis-cli ping
# Should return: PONG

# Test 14: Nginx Configuration Test
docker-compose exec nginx nginx -t

# Test 15: Container Status
docker-compose ps

# Test 16: Network Connectivity
docker network ls
docker network inspect ecom-admin_ecom-network
```

---

## 🧪 Comprehensive Test Suite

### Quick Test Script

Create this test script to run all checks:

```bash
# Create: scripts/test-all.bat
@echo off
echo 🧪 Running Complete Test Suite...

echo.
echo 📋 Test 1: Health Endpoint
curl -f http://localhost:3000/api/health && echo ✅ Health OK || echo ❌ Health Failed

echo.
echo 📋 Test 2: Main Application
curl -f http://localhost:3000 && echo ✅ App OK || echo ❌ App Failed

echo.
echo 📋 Test 3: Nginx Proxy
curl -f http://localhost && echo ✅ Nginx OK || echo ❌ Nginx Failed

echo.
echo 📋 Test 4: Docker Containers
docker-compose ps

echo.
echo 📋 Test 5: Container Health
docker-compose exec app wget --spider -q http://localhost:3000/api/health && echo ✅ Container Health OK || echo ❌ Container Health Failed

echo.
echo ✅ Test Suite Completed!
pause
```

### Individual Service Tests

```bash
# Test Next.js App Only
npm run dev
curl http://localhost:3000/api/health

# Test Docker Build Only
docker build -t ecom-admin:latest .

# Test Nginx Config Only
docker run --rm nginx:alpine nginx -t -c /etc/nginx/nginx.conf

# Test Redis Only
docker run --rm redis:7-alpine redis-server --test-memory 1mb
```

---

## 📊 Monitoring & Debugging

### Container Monitoring

```bash
# Monitor resource usage
docker stats

# View container logs
docker-compose logs -f [service_name]

# Inspect container
docker inspect ecom-admin-app

# Execute commands in container
docker-compose exec app /bin/sh
```

### Network Debugging

```bash
# Test network connectivity
docker-compose exec app ping nginx
docker-compose exec nginx ping app

# Check port usage
netstat -ano | findstr :80
netstat -ano | findstr :3000
netstat -ano | findstr :6379
```

### Performance Testing

```bash
# Load test with curl
for /l %i in (1,1,10) do curl http://localhost/api/health

# Memory usage
docker-compose exec app ps aux

# Disk usage
docker system df
```

---

## 🔧 Troubleshooting Commands

### Common Issues

```bash
# Port already in use
netstat -ano | findstr :80
taskkill /PID <PID_NUMBER> /F

# Docker build fails
docker system prune -a
docker-compose build --no-cache

# Container won't start
docker-compose logs app
docker-compose restart app

# Environment variables not loading
docker-compose config
docker-compose exec app env | grep NEXT_PUBLIC

# Clear all Docker data
docker system prune -a --volumes
```

### Service Restart Commands

```bash
# Restart specific service
docker-compose restart app
docker-compose restart nginx
docker-compose restart redis

# Rebuild and restart
docker-compose up -d --build app

# Force recreate
docker-compose up -d --force-recreate
```

---

## 🚀 Deployment Commands

### Development Deployment

```bash
# Start development environment
docker-compose up -d

# Start with logs
docker-compose up

# Stop environment
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production Deployment

```bash
# Production build and deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Scale application
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Rolling update
docker-compose -f docker-compose.prod.yml up -d --no-deps app

# Production stop
docker-compose -f docker-compose.prod.yml down
```

### Backup & Restore

```bash
# Backup Redis data
docker-compose exec redis redis-cli BGSAVE

# Export container
docker export ecom-admin-app > ecom-admin-backup.tar

# Import container
docker import ecom-admin-backup.tar ecom-admin:backup
```

---

## 📝 Scripts & Commands Reference

### Package Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

### Docker Scripts

- `scripts/build.bat` — Build Docker image with env vars
- `scripts/deploy.bat` — Deploy to production
- `scripts/dev.bat` — Start development environment
- `scripts/test-all.bat` — Run complete test suite

### Quick Commands

```bash
# One-line health check
curl -f http://localhost/api/health && echo "✅ Healthy" || echo "❌ Unhealthy"

# One-line container status
docker-compose ps --services --filter status=running

# One-line log tail
docker-compose logs -f --tail=50 app
```

---

## 🔒 Security Testing

```bash
# Test security headers
curl -I http://localhost

# Test rate limiting
for /l %i in (1,1,100) do curl http://localhost/api/health

# Test SSL (when configured)
curl -I https://localhost

# Check for vulnerabilities
npm audit
docker scout cves ecom-admin:latest
```

---

## 📚 Documentation

- **Deployment Guide**: See `DEPLOYMENT.md` for detailed deployment instructions
- **API Documentation**: Available at `/api/health` for health checks
- **Component Documentation**: See inline comments in component files
- **Database Schema**: Generated types in `src/types/database.types.ts`

---

## 🛡️ License

This project is licensed under the MIT License.

---

## 💡 Credits

- Built by Mucrypt and contributors
- Powered by Next.js, Supabase, Docker, and the open-source community

---

## 📬 Contact

For support or questions, open an issue or reach out via GitHub.

---

## 🔧 Docker Troubleshooting

### Docker Desktop Not Running

If you see pipe connection errors:

```bash
# Error: open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file
# Solution: Start Docker Desktop

# Check if Docker Desktop is running
docker info

# Start Docker Desktop (if not running)
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"

# Wait 1-2 minutes, then test
docker run hello-world
```

### Quick Docker Health Check

```bash
# Test Docker installation
docker --version
docker info
docker run hello-world

# If all pass, proceed with app testing
npm run dev
```

### Alternative Testing (No Docker)

If Docker issues persist, test without Docker:

```bash
# Method 1: Local Development
npm install
npm run dev
# Visit: http://localhost:3000

# Method 2: Local Production Build
npm run build
npm start
# Visit: http://localhost:3000

# Method 3: Health Check Test
curl http://localhost:3000/api/health
```

### Complete Test Sequence

Run these commands **after Docker Desktop starts**:

```bash
# 1. Verify Docker works
docker run hello-world

# 2. Test your app locally first
npm run dev
# Open new terminal for next steps

# 3. Test Docker build
docker build -t ecom-admin:test .

# 4. Test Docker run
docker run -p 3001:3000 --env-file .env.local ecom-admin:test
# Visit: http://localhost:3001

# 5. Test Docker Compose
docker-compose up --build
# Visit: http://localhost (Nginx) and http://localhost:3000 (Direct)
```

---

## 🎯 Step-by-Step Testing Guide

### Phase 1: Basic Setup (No Docker)

```bash
npm install                           # Install dependencies
npm run dev                          # Start dev server
# Test: http://localhost:3000
# Test: http://localhost:3000/api/health
```

### Phase 2: Docker Single Container

```bash
docker run hello-world               # Verify Docker works ✅
docker build -t ecom-admin:test .    # Build your image
docker run -p 3001:3000 ecom-admin:test  # Run container
# Test: http://localhost:3001
```

### Phase 3: Docker Compose Development

```bash
docker-compose up --build            # Start all services
# Test: http://localhost (Nginx)
# Test: http://localhost:3000 (Direct app)
# Test: http://localhost/api/health
```

### Phase 4: Production Setup

```bash
docker-compose -f docker-compose.prod.yml up -d --build
# Test: http://localhost
# Test: Production health check
```

---

## 🚨 Quick Fixes

### If Docker Desktop Won't Start

```bash
# Restart Docker Desktop service
net stop com.docker.service
net start com.docker.service

# Or restart as admin
# Right-click Docker Desktop icon → Restart
```

### If Ports Are Busy

```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID_NUMBER> /F

# Alternative ports for testing
docker run -p 3001:3000 ecom-admin:test    # Use port 3001
docker run -p 3002:3000 ecom-admin:test    # Use port 3002
```

### If Build Fails

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t ecom-admin:test .

# Check Dockerfile syntax
docker build --progress=plain -t ecom-admin:test .
```
