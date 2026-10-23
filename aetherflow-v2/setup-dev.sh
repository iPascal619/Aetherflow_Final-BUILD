#!/usr/bin/env bash

# AetherFlow v2.0 Development Setup Script

echo " Setting up AetherFlow v2.0 Development Environment"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo " Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo " Docker Compose is not installed. Please install Docker Compose first."
    echo "   Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo " Docker and Docker Compose are available"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo " Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql+asyncpg://aetherflow_user:aetherflow_password@localhost:5432/aetherflow_db
DATABASE_ECHO=false
DATABASE_POOL_SIZE=10
DATABASE_MAX_OVERFLOW=20

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-change-in-production-$(openssl rand -hex 32)
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Service URLs (for inter-service communication)
AUTH_SERVICE_URL=http://auth-service:8000
PATIENT_SERVICE_URL=http://patient-service:8000
ML_SERVICE_URL=http://ml-service:8000

# MinIO Configuration
MINIO_ROOT_USER=aetherflow
MINIO_ROOT_PASSWORD=aetherflow123

# Development flags
DEBUG=true
LOG_LEVEL=INFO
EOF
    echo " Created .env file with default configuration"
else
    echo " .env file already exists"
fi

echo ""
echo " Starting infrastructure services..."
echo "======================================"

# Start infrastructure services
docker-compose up -d postgres redis minio traefik

echo " Waiting for services to be ready..."
sleep 10

# Check if PostgreSQL is ready
echo " Checking PostgreSQL connection..."
until docker-compose exec postgres pg_isready -U aetherflow_user -d aetherflow_db; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done
echo " PostgreSQL is ready"

# Check if Redis is ready
echo " Checking Redis connection..."
until docker-compose exec redis redis-cli ping | grep -q "PONG"; do
    echo "   Waiting for Redis..."
    sleep 2
done
echo " Redis is ready"

echo ""
echo " Building and starting backend services..."
echo "==========================================="

# Build and start backend services
docker-compose up -d auth-service patient-service ml-service

echo " Waiting for backend services to start..."
sleep 15

# Check service health
echo ""
echo " Checking service health..."
echo "============================"

services=("auth-service" "patient-service" "ml-service")
for service in "${services[@]}"; do
    echo " Checking $service..."
    for i in {1..10}; do
        if curl -f -s http://localhost/api/v1/${service#*-}/health > /dev/null 2>&1; then
            echo " $service is healthy"
            break
        else
            if [ $i -eq 10 ]; then
                echo "  $service may not be ready yet"
            else
                echo "   Attempt $i/10 - waiting..."
                sleep 3
            fi
        fi
    done
done

echo ""
echo " Service Status Summary"
echo "======================="
echo " API Gateway (Traefik): http://localhost:8080"
echo " Auth Service: http://localhost/api/v1/auth"  
echo " Patient Service: http://localhost/api/v1/patients"
echo " ML Service: http://localhost/api/v1/ml"
echo " MinIO Console: http://localhost:9001 (aetherflow/aetherflow123)"
echo " Database: localhost:5432 (aetherflow_user/aetherflow_password)"
echo " Redis: localhost:6379"

echo ""
echo " Next Steps:"
echo "============="
echo "1. View service logs: docker-compose logs -f [service-name]"
echo "2. Access API documentation: http://localhost/api/v1/auth/docs"  
echo "3. Set up the frontend application"
echo "4. Import test data using the API endpoints"

echo ""
echo " AetherFlow v2.0 backend is ready!"
echo "=================================="