# 🚀 E-commerce Admin Deployment Guide

## Quick Start Commands

### Development

```bash
# Start development environment
scripts\dev.bat

# Or manually
docker-compose up -d
```

### Production

```bash
# Deploy to production
scripts\deploy.bat

# Or manually
docker-compose -f docker-compose.prod.yml up -d --build
```

### Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild specific service
docker-compose build app

# Scale application
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

## Access Points

- **Application**: <http://localhost>
- **Direct App**: <http://localhost:3000>
- **Redis**: localhost:6379

## Monitoring

- **Health Check**: <http://localhost/health>
- **Nginx Logs**: nginx/logs/
- **Container Logs**: `docker-compose logs [service_name]`

## Troubleshooting

### Common Issues

**Port already in use:**

```bash
# Stop all Docker containers
docker stop $(docker ps -aq)

# Or kill specific ports
netstat -ano | findstr :80
taskkill /PID <PID_NUMBER> /F
```

**Docker build fails:**

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

**Environment variables not loading:**

```bash
# Verify .env.local exists and has correct values
# Restart containers after env changes
docker-compose restart
```

### Performance Monitoring

```bash
# Monitor container resources
docker stats

# Check container logs
docker-compose logs -f app
docker-compose logs -f nginx

# Test health endpoint
curl http://localhost/health
```
