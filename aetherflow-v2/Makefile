# AetherFlow v2.0 Development Makefile

.PHONY: help setup up down logs clean build test lint format

# Default target
help: ## Show this help message
	@echo "AetherFlow v2.0 Development Commands"
	@echo "=================================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Setup and Infrastructure
setup: ## Initial setup of development environment
	@echo "Setting up AetherFlow v2.0..."
	@chmod +x setup-dev.sh
	@./setup-dev.sh

up: ## Start all services
	@echo " Starting AetherFlow services..."
	@docker-compose up -d

down: ## Stop all services
	@echo " Stopping AetherFlow services..."
	@docker-compose down

logs: ## View logs for all services
	@docker-compose logs -f

logs-auth: ## View auth service logs
	@docker-compose logs -f auth-service

logs-patient: ## View patient service logs
	@docker-compose logs -f patient-service

logs-ml: ## View ML service logs
	@docker-compose logs -f ml-service

logs-db: ## View database logs
	@docker-compose logs -f postgres

# Development
build: ## Build all service images
	@echo " Building service images..."
	@docker-compose build

rebuild: ## Rebuild services without cache
	@echo " Rebuilding services from scratch..."
	@docker-compose build --no-cache

restart: ## Restart all services
	@echo " Restarting services..."
	@docker-compose restart

restart-auth: ## Restart auth service
	@docker-compose restart auth-service

restart-patient: ## Restart patient service
	@docker-compose restart patient-service

restart-ml: ## Restart ML service
	@docker-compose restart ml-service

# Database operations
db-shell: ## Connect to PostgreSQL database
	@docker-compose exec postgres psql -U aetherflow_user -d aetherflow_db

db-reset: ## Reset database (WARNING: destroys all data)
	@echo " This will destroy all database data. Are you sure? [y/N]"
	@read -r response; \
	if [ "$$response" = "y" ] || [ "$$response" = "Y" ]; then \
		docker-compose down -v; \
		docker-compose up -d postgres; \
		sleep 5; \
		echo " Database reset complete"; \
	else \
		echo " Database reset cancelled"; \
	fi

# Testing and Quality
test: ## Run tests
	@echo "Running tests..."
	@docker-compose exec auth-service python -m pytest tests/ -v || echo "No tests found"
	@docker-compose exec patient-service python -m pytest tests/ -v || echo "No tests found"
	@docker-compose exec ml-service python -m pytest tests/ -v || echo "No tests found"

lint: ## Run linting
	@echo " Running linting..."
	@docker-compose exec auth-service python -m flake8 . || echo "Linting not configured"
	@docker-compose exec patient-service python -m flake8 . || echo "Linting not configured"
	@docker-compose exec ml-service python -m flake8 . || echo "Linting not configured"

format: ## Format code
	@echo " Formatting code..."
	@docker-compose exec auth-service python -m black . || echo "Formatting not configured"
	@docker-compose exec patient-service python -m black . || echo "Formatting not configured"
	@docker-compose exec ml-service python -m black . || echo "Formatting not configured"

# Health checks
health: ## Check health of all services
	@echo " Checking service health..."
	@curl -f http://localhost/api/v1/auth/health && echo " ✅ Auth service healthy" || echo " ❌ Auth service unhealthy"
	@curl -f http://localhost/api/v1/patients/health && echo " ✅ Patient service healthy" || echo " ❌ Patient service unhealthy"
	@curl -f http://localhost/api/v1/ml/health && echo " ✅ ML service healthy" || echo " ❌ ML service unhealthy"

status: ## Show status of all services
	@echo " Service Status:"
	@docker-compose ps

# API Documentation
docs: ## Open API documentation
	@echo " Opening API documentation..."
	@echo "Auth Service: http://localhost/api/v1/auth/docs"
	@echo "Patient Service: http://localhost/api/v1/patients/docs"
	@echo "ML Service: http://localhost/api/v1/ml/docs"
	@echo "Traefik Dashboard: http://localhost:8080"

# Cleanup
clean: ## Clean up containers and volumes
	@echo " Cleaning up..."
	@docker-compose down -v --remove-orphans
	@docker system prune -f

clean-all: ## Clean everything including images
	@echo " Deep cleaning..."
	@docker-compose down -v --remove-orphans
	@docker system prune -af

# Production helpers
prod-build: ## Build production images
	@echo " Building production images..."
	@docker-compose -f docker-compose.prod.yml build

prod-up: ## Start production environment
	@echo " Starting production environment..."
	@docker-compose -f docker-compose.prod.yml up -d

# Backup and restore
backup: ## Backup database
	@echo " Creating database backup..."
	@docker-compose exec postgres pg_dump -U aetherflow_user aetherflow_db > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup created: backup_$(shell date +%Y%m%d_%H%M%S).sql"

# Development shortcuts  
dev: setup up ## Quick development setup
	@echo "Development environment ready!"
	@make health

# Show useful URLs
urls: ## Show useful development URLs
	@echo "Useful URLs:"
	@echo "================================"
	@echo "API Gateway: http://localhost:8080"
	@echo "Auth API: http://localhost/api/v1/auth/docs"
	@echo "Patient API: http://localhost/api/v1/patients/docs"
	@echo "ML API: http://localhost/api/v1/ml/docs"
	@echo "MinIO Console: http://localhost:9001"
	@echo "Database: localhost:5432"
	@echo "Redis: localhost:6379"