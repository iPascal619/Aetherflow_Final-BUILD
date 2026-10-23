# AetherFlow - Healthcare AI Platform

A comprehensive healthcare AI platform for sickle cell disease management and crisis prediction. AetherFlow provides healthcare providers with intelligent tools for patient monitoring, risk assessment, and proactive intervention.

## Overview

AetherFlow is designed to revolutionize sickle cell disease care through advanced machine learning algorithms and intuitive healthcare interfaces. The platform offers predictive analytics, patient management, and real-time monitoring capabilities to improve patient outcomes and reduce crisis events.

## Table of Contents

- [Project Structure](#project-structure)
- [Version Comparison](#version-comparison)
- [Quick Start](#quick-start)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

```
AetherFlow_Final-BUILD/
├── aetherflow-v1/              # Legacy standalone application
│   ├── add-patient.html        # Patient registration interface
│   ├── dashboard.html          # Main dashboard
│   ├── patients.html           # Patient management
│   ├── reports.html            # Analytics and reports
│   ├── js/                     # Frontend JavaScript
│   ├── css/                    # Styling and themes
│   ├── model/                  # ML models and training scripts
│   ├── api/                    # Express.js API server
│   └── ai-server/              # AI inference server
│
├── aetherflow-v2/              # Modern microservices architecture
│   ├── backend/
│   │   ├── auth-service/       # Authentication & authorization
│   │   ├── patient-service/    # Patient data management
│   │   ├── ml-service/        # ML predictions & analytics
│   │   └── shared/            # Common utilities
│   ├── frontend/              # Next.js React application
│   ├── mobile/                # React Native app (planned)
│   └── docs/                  # Technical documentation
│
├── .github/                   # GitHub workflows and templates
└── README.md                  # This file
```

## Version Comparison

| Feature | AetherFlow v1 | AetherFlow v2 |
|---------|---------------|---------------|
| **Architecture** | Monolithic | Microservices |
| **Frontend** | Vanilla HTML/JS | Next.js + TypeScript |
| **Backend** | Express.js | FastAPI Services |
| **Database** | Local Storage | PostgreSQL + Redis |
| **Authentication** | Basic | JWT + Role-based |
| **Deployment** | Standalone | Docker + Kubernetes |
| **Scalability** | Limited | Highly Scalable |
| **Mobile Support** | Web-only | Progressive + Native |
| **API** | REST | REST + GraphQL |
| **ML Pipeline** | Basic | Advanced MLOps |

## Quick Start

### AetherFlow v1 (Standalone)
```bash
cd aetherflow-v1
# Open index.html in browser or run with live server
python -m http.server 8000
```

### AetherFlow v2 (Microservices)
```bash
cd aetherflow-v2

# Start with Docker Compose
docker-compose up -d

# Or manual setup
cd frontend && npm install && npm run dev
cd backend && docker-compose up -d
```

## Features

### Patient Management
- **Comprehensive Profiles**: Complete patient demographics, medical history, and contact information
- **Real-time Monitoring**: Continuous tracking of vital signs and symptoms
- **Assessment Tools**: Standardized questionnaires and risk evaluation forms
- **Provider Collaboration**: Multi-provider access with role-based permissions

### AI-Powered Predictions
- **Crisis Prediction**: Machine learning models predict sickle cell crisis probability
- **Risk Stratification**: Automated patient risk categorization
- **Trend Analysis**: Historical data patterns and progression tracking
- **Explainable AI**: Clear explanations for all AI-driven recommendations

### Analytics & Reporting
- **Interactive Dashboards**: Real-time visualization of patient data and trends
- **Custom Reports**: Configurable reports for different stakeholders
- **Population Health**: Aggregate insights across patient populations
- **Performance Metrics**: Healthcare outcomes and intervention effectiveness

### Security & Compliance
- **HIPAA Compliance**: Full adherence to healthcare data protection standards
- **Role-Based Access**: Granular permissions for different user types
- **Audit Trails**: Complete logging of all system interactions
- **Data Encryption**: End-to-end encryption for all sensitive data

## Technology Stack

### Frontend (v2)
- **Next.js 14**: React framework with app router and server-side rendering
- **TypeScript**: Type-safe development with modern JavaScript features
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Query**: Efficient data fetching and caching
- **Chart.js**: Interactive data visualizations

### Backend (v2)
- **FastAPI**: High-performance Python API framework
- **PostgreSQL**: Robust relational database for patient data
- **Redis**: In-memory caching and session storage
- **MinIO**: S3-compatible object storage for files
- **Traefik**: API gateway and load balancer

### Machine Learning
- **Python**: Core ML development language
- **scikit-learn**: Traditional machine learning algorithms
- **TensorFlow**: Deep learning models for complex predictions
- **MLflow**: ML lifecycle management and model versioning
- **Pandas/NumPy**: Data processing and numerical computing

### Infrastructure
- **Docker**: Containerization for consistent deployments
- **Docker Compose**: Multi-container orchestration
- **Kubernetes**: Production-grade container orchestration
- **GitHub Actions**: CI/CD pipeline automation

## Installation

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Memory**: 8GB RAM minimum (16GB recommended)
- **Storage**: 10GB available space
- **Network**: Internet connection for initial setup

### Prerequisites
```bash
# Install Docker
# Windows: Download Docker Desktop
# macOS: brew install --cask docker
# Linux: sudo apt-get install docker.io docker-compose

# Install Node.js 18+
# Windows: Download from nodejs.org
# macOS: brew install node
# Linux: sudo apt-get install nodejs npm

# Install Python 3.11+
# Windows: Download from python.org
# macOS: brew install python@3.11
# Linux: sudo apt-get install python3.11
```

### Development Setup

1. **Clone the Repository**
```bash
git clone https://github.com/iPascal619/Aetherflow_Final-BUILD.git
cd AetherFlow_Final-BUILD
```

2. **Choose Your Version**

**For v1 (Simple Setup):**
```bash
cd aetherflow-v1
# Open in browser or start local server
python -m http.server 8000
```

**For v2 (Full Platform):**
```bash
cd aetherflow-v2

# Start infrastructure
docker-compose up -d postgres redis minio

# Install frontend dependencies
cd frontend
npm install

# Start development servers
npm run dev            # Frontend (port 3000)
cd ../backend && docker-compose up -d  # Backend services
```

## Usage

### Healthcare Providers

1. **Patient Onboarding**
   - Register new patients with comprehensive medical profiles
   - Import existing medical records and history
   - Set up monitoring parameters and alert preferences

2. **Daily Workflow**
   - Review patient dashboard for high-risk alerts
   - Input new assessment data and symptoms
   - Monitor AI predictions and recommendations
   - Generate reports for patient consultations

3. **Crisis Management**
   - Receive real-time alerts for potential crisis events
   - Access emergency protocols and intervention guidelines
   - Track patient response and recovery metrics

### Patients (Mobile/Web Portal)

1. **Self-Monitoring**
   - Daily symptom tracking and pain scale reporting
   - Medication adherence logging
   - Vital sign input (if available)

2. **Communication**
   - Secure messaging with healthcare providers
   - Appointment scheduling and reminders
   - Educational resources and care plans

## Development

### Contributing Guidelines

1. **Fork and Clone**
```bash
git fork https://github.com/iPascal619/Aetherflow_Final-BUILD.git
git clone https://github.com/your-fork/Aetherflow_Final-BUILD.git
cd AetherFlow_Final-BUILD
```

2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Development Workflow**
```bash
# For v2 development
cd aetherflow-v2
docker-compose up -d              # Start services
cd frontend && npm run dev        # Start frontend
cd backend && npm test           # Run tests
```

4. **Testing**
```bash
# Frontend tests
cd frontend && npm run test

# Backend tests
cd backend && python -m pytest

# Integration tests
docker-compose -f docker-compose.test.yml up
```

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with healthcare-specific rules
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality assurance
- **Conventional Commits**: Standardized commit messages

### API Development

All APIs follow RESTful principles with OpenAPI 3.0 documentation:

```bash
# Start API server
cd aetherflow-v2/backend
docker-compose up -d

# Access API documentation
open http://localhost/docs        # Swagger UI
open http://localhost/redoc       # ReDoc
```

## API Documentation

### Authentication Endpoints
```
POST /api/v1/auth/login          # User login
POST /api/v1/auth/logout         # User logout  
POST /api/v1/auth/refresh        # Token refresh
POST /api/v1/auth/register       # User registration
```

### Patient Management
```
GET    /api/v1/patients          # List patients
POST   /api/v1/patients          # Create patient
GET    /api/v1/patients/:id      # Get patient details
PUT    /api/v1/patients/:id      # Update patient
DELETE /api/v1/patients/:id      # Delete patient
```

### ML Predictions
```
POST /api/v1/ml/predict          # Generate crisis prediction
GET  /api/v1/ml/models           # List available models
POST /api/v1/ml/assess           # Risk assessment
GET  /api/v1/ml/analytics        # Population analytics
```

## Security

### Data Protection
- **Encryption**: AES-256 encryption for data at rest
- **TLS**: All communications secured with TLS 1.3
- **Authentication**: Multi-factor authentication support
- **Authorization**: Fine-grained role-based access control

### Compliance
- **HIPAA**: Full compliance with healthcare data regulations
- **GDPR**: European data protection compliance
- **SOC 2**: Security and availability controls
- **HITECH**: Healthcare technology security standards

### Security Features
- **Rate Limiting**: API abuse prevention
- **Input Validation**: SQL injection and XSS protection
- **Session Management**: Secure session handling
- **Audit Logging**: Comprehensive security event logging

## Contributing

We welcome contributions from the healthcare technology community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Areas for Contribution
- **Machine Learning**: Model improvements and new algorithms
- **Frontend**: UI/UX enhancements and accessibility
- **Backend**: Performance optimizations and new features
- **Documentation**: Technical writing and tutorials
- **Testing**: Quality assurance and test coverage

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/iPascal619/Aetherflow_Final-BUILD/issues)
- **Discussions**: [GitHub Discussions](https://github.com/iPascal619/Aetherflow_Final-BUILD/discussions)
- **Email**: pascalonuoha324@gmail.com

## Acknowledgments

- Healthcare providers who provided domain expertise
- Open source contributors and maintainers
- Medical researchers in sickle cell disease
- Patient advocacy groups and community feedback

---

**Made with care for better healthcare outcomes**