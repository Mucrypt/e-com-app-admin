@echo off
echo 🚀 Deploying E-commerce Admin Application...

REM Stop existing containers
docker-compose down

REM Build and start containers
docker-compose -f docker-compose.prod.yml up -d --build

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak

REM Check if services are running
docker-compose -f docker-compose.prod.yml ps

REM Test health endpoint
curl -f http://localhost/health || echo ❌ Health check failed

echo ✅ Deployment completed!
pause