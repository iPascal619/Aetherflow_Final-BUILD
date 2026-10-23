# AetherFlow v2.0 - Complete Architecture Overhaul

A modern, scalable healthcare application for sickle cell crisis prediction using microservices architecture.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Backend       │
│   (Next.js)     │◄──►│   (Traefik)     │◄──►│   Services      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────────────────────┼─────────────────────────────────┐
                       │                                 │                                 │
                ┌──────▼──────┐              ┌──────────▼──────────┐              ┌──────▼──────┐
                │Auth Service │              │  Patient Service    │              │ ML Service  │
                │             │              │                     │              │             │
                └─────────────┘              └─────────────────────┘              └─────────────┘
                       │                                 │                                 │
                       └─────────────────────────────────┼─────────────────────────────────┘
                                                         │
                              ┌─────────────────────────────────────────────────────┐
                              │                  Data Layer                         │
                              │  PostgreSQL  │  Redis Cache  │  MinIO Storage      │
                              └─────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.11+ (for ML service development)

### Development Setup
```bash
# Clone and setup
git clone https://github.com/iPascal619/Aetherflow_Final-BUILD.git
cd Aetherflow_Final-BUILD/aetherflow-v2

# Start infrastructure services
docker-compose up -d postgres redis minio traefik

# Start backend services
docker-compose up -d auth-service patient-service ml-service

# Install and start frontend
cd frontend
npm install
npm run dev
```

## Project Structure

```
aetherflow-v2/
├── backend/
│   ├── auth-service/          # Authentication & authorization
│   ├── patient-service/       # Patient management
│   ├── ml-service/           # ML predictions & analytics
│   └── shared/               # Shared utilities & types
├── frontend/                 # Next.js web application
├── mobile/                   # React Native (future)
├── docs/                     # Documentation
├── docker-compose.yml        # Development environment
└── README.md
```

## Services

### Authentication Service (`/api/v1/auth`)
- JWT-based authentication
- Role-based access control (Patient/Provider/Admin)
- Session management
- Password reset functionality

### Patient Service (`/api/v1/patients`)
- Patient profile management
- Medical history tracking
- Assessment data storage
- Healthcare provider associations

### ML Service (`/api/v1/ml`)
- Sickle cell crisis prediction
- Risk assessment algorithms
- Model monitoring & analytics
- Explainable AI features

## Development Commands

```bash
# Infrastructure
docker-compose up -d postgres redis minio    # Start databases
docker-compose logs -f auth-service          # View service logs
docker-compose down                          # Stop all services

# Backend Development
cd backend/auth-service && python -m uvicorn main:app --reload
cd backend/patient-service && python -m uvicorn main:app --reload
cd backend/ml-service && python -m uvicorn main:app --reload

# Frontend Development
cd frontend && npm run dev                   # Start Next.js dev server
cd frontend && npm run build                 # Build for production
cd frontend && npm run test                  # Run tests
```

## Security & Compliance

- HIPAA-compliant data handling
- End-to-end encryption
- Audit logging
- Role-based access control
- OAuth2/JWT authentication

## Monitoring & Analytics

- Health checks for all services
- Distributed tracing
- Performance metrics
- Error tracking
- ML model monitoring

## Testing

- Unit tests for all services
- Integration tests
- E2E testing with Playwright
- Load testing
- Security testing

## API Documentation

- Interactive API docs: http://localhost/docs
- Service-specific documentation in each service directory
- OpenAPI 3.0 specifications

## Deployment

- Docker containerization
- Kubernetes manifests
- CI/CD with GitHub Actions
- Environment-specific configurations
- Blue-green deployment strategy