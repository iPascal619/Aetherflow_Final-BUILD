@echo off
REM AetherFlow v2.0 Development Setup Script for Windows

echo  Setting up AetherFlow v2.0 Development Environment
echo ==================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker is not installed. Please install Docker Desktop first.
    echo    Visit: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed  
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo  Docker Compose is not installed. Please install Docker Desktop first.
    echo    Visit: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)

echo  Docker and Docker Compose are available

REM Create .env file if it doesn't exist
if not exist .env (
    echo  Creating .env file...
    (
        echo # Database Configuration
        echo DATABASE_URL=postgresql+asyncpg://aetherflow_user:aetherflow_password@localhost:5432/aetherflow_db
        echo DATABASE_ECHO=false
        echo DATABASE_POOL_SIZE=10
        echo DATABASE_MAX_OVERFLOW=20
        echo.
        echo # JWT Configuration  
        echo JWT_SECRET=your-super-secret-jwt-key-change-in-production-dev
        echo JWT_ALGORITHM=HS256
        echo ACCESS_TOKEN_EXPIRE_MINUTES=30
        echo REFRESH_TOKEN_EXPIRE_DAYS=30
        echo.
        echo # Redis Configuration
        echo REDIS_URL=redis://localhost:6379
        echo.
        echo # Service URLs
        echo AUTH_SERVICE_URL=http://auth-service:8000
        echo PATIENT_SERVICE_URL=http://patient-service:8000
        echo ML_SERVICE_URL=http://ml-service:8000
        echo.
        echo # MinIO Configuration
        echo MINIO_ROOT_USER=aetherflow
        echo MINIO_ROOT_PASSWORD=aetherflow123
        echo.
        echo # Development flags
        echo DEBUG=true
        echo LOG_LEVEL=INFO
    ) > .env
    echo  Created .env file with default configuration
) else (
    echo  .env file already exists
)

echo.
echo  Starting infrastructure services...
echo ======================================

REM Start infrastructure services
docker-compose up -d postgres redis minio traefik

echo  Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if PostgreSQL is ready
echo  Checking PostgreSQL connection...
:wait_postgres
docker-compose exec postgres pg_isready -U aetherflow_user -d aetherflow_db >nul 2>&1
if errorlevel 1 (
    echo    Waiting for PostgreSQL...
    timeout /t 2 /nobreak >nul
    goto wait_postgres
)
echo  PostgreSQL is ready

REM Check if Redis is ready
echo  Checking Redis connection...
:wait_redis
docker-compose exec redis redis-cli ping | findstr "PONG" >nul 2>&1
if errorlevel 1 (
    echo    Waiting for Redis...
    timeout /t 2 /nobreak >nul
    goto wait_redis
)
echo  Redis is ready

echo.
echo  Building and starting backend services...
echo ===========================================

REM Build and start backend services
docker-compose up -d auth-service patient-service ml-service

echo  Waiting for backend services to start...
timeout /t 15 /nobreak >nul

echo.
echo  Service Status Summary
echo =======================
echo  API Gateway (Traefik): http://localhost:8080
echo  Auth Service: http://localhost/api/v1/auth
echo  Patient Service: http://localhost/api/v1/patients  
echo  ML Service: http://localhost/api/v1/ml
echo  MinIO Console: http://localhost:9001 (aetherflow/aetherflow123)
echo  Database: localhost:5432 (aetherflow_user/aetherflow_password)
echo  Redis: localhost:6379

echo.
echo  Next Steps:
echo =============
echo 1. View service logs: docker-compose logs -f [service-name]
echo 2. Access API documentation: http://localhost/api/v1/auth/docs
echo 3. Set up the frontend application
echo 4. Import test data using the API endpoints

echo.
echo  AetherFlow v2.0 backend is ready!
echo ==================================
pause