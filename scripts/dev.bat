@echo off
echo 🚀 Starting Development Environment...

REM Start development containers
docker-compose up -d

echo ⏳ Waiting for services to start...
timeout /t 20 /nobreak

REM Open browser
start http://localhost

echo ✅ Development environment started!
echo 📱 App: http://localhost
echo 🔧 Nginx: http://localhost:80
echo 🗄️ Redis: localhost:6379

pause