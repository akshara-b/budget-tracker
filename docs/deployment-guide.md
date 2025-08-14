# Budget AI - Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the Budget AI application to various cloud platforms and environments. The application consists of a FastAPI backend and a React frontend.

## 📋 Prerequisites

### Required Tools
- **Git**: Version control
- **Docker**: Containerization (optional but recommended)
- **Cloud CLI Tools**: AWS CLI, Azure CLI, or Google Cloud CLI
- **MongoDB**: Database (local or cloud)

### Environment Requirements
- **Backend**: Python 3.8+, 1GB+ RAM, 1 CPU
- **Frontend**: Node.js 18+, 512MB+ RAM
- **Database**: MongoDB 4.4+, 1GB+ storage

## 🐳 Docker Deployment

### Backend Dockerfile

Create `server/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile

Create `client/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml` in the root directory:
```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URL=mongodb://mongodb:27017
      - DATABASE_NAME=budget_ai
      - SECRET_KEY=your-secret-key
    depends_on:
      - mongodb
    restart: unless-stopped

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=budget_ai
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

### Running with Docker

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## ☁️ Cloud Deployment

### AWS Deployment

#### Option 1: AWS ECS (Elastic Container Service)

1. **Create ECR Repository**
```bash
aws ecr create-repository --repository-name budget-ai-backend
aws ecr create-repository --repository-name budget-ai-frontend
```

2. **Build and Push Images**
```bash
# Backend
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
docker build -t budget-ai-backend ./server
docker tag budget-ai-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/budget-ai-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/budget-ai-backend:latest

# Frontend
docker build -t budget-ai-frontend ./client
docker tag budget-ai-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/budget-ai-frontend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/budget-ai-frontend:latest
```

3. **Create ECS Cluster and Services**
```bash
# Create cluster
aws ecs create-cluster --cluster-name budget-ai-cluster

# Create task definitions (JSON files required)
aws ecs register-task-definition --cli-input-json file://backend-task-definition.json
aws ecs register-task-definition --cli-input-json file://frontend-task-definition.json

# Create services
aws ecs create-service --cluster budget-ai-cluster --service-name backend-service --task-definition backend-task-definition:1
aws ecs create-service --cluster budget-ai-cluster --service-name frontend-service --task-definition frontend-task-definition:1
```

#### Option 2: AWS Lambda + API Gateway (Serverless)

1. **Install Serverless Framework**
```bash
npm install -g serverless
```

2. **Create serverless.yml**
```yaml
service: budget-ai-backend

provider:
  name: aws
  runtime: python3.11
  region: us-east-1
  environment:
    MONGODB_URL: ${env:MONGODB_URL}
    DATABASE_NAME: ${env:DATABASE_NAME}
    SECRET_KEY: ${env:SECRET_KEY}

functions:
  api:
    handler: app.main.handler
    events:
      - http:
          path: /{proxy+}
          method: ANY
          cors: true
    memorySize: 512
    timeout: 30

plugins:
  - serverless-python-requirements

custom:
  pythonRequirements:
    dockerizePip: true
```

3. **Deploy**
```bash
serverless deploy
```

### Azure Deployment

#### Option 1: Azure Container Instances

1. **Build and Push to Azure Container Registry**
```bash
# Login to Azure
az login

# Create resource group
az group create --name budget-ai-rg --location eastus

# Create container registry
az acr create --resource-group budget-ai-rg --name budgetaiacr --sku Basic

# Login to ACR
az acr login --name budgetaiacr

# Build and push images
az acr build --registry budgetaiacr --image budget-ai-backend:latest ./server
az acr build --registry budgetaiacr --image budget-ai-frontend:latest ./client
```

2. **Deploy Backend**
```bash
az container create \
  --resource-group budget-ai-rg \
  --name budget-ai-backend \
  --image budgetaiacr.azurecr.io/budget-ai-backend:latest \
  --dns-name-label budget-ai-backend \
  --ports 8000 \
  --environment-variables \
    MONGODB_URL="your-mongodb-connection-string" \
    DATABASE_NAME="budget_ai" \
    SECRET_KEY="your-secret-key"
```

3. **Deploy Frontend**
```bash
az container create \
  --resource-group budget-ai-rg \
  --name budget-ai-frontend \
  --image budgetaiacr.azurecr.io/budget-ai-frontend:latest \
  --dns-name-label budget-ai-frontend \
  --ports 80
```

#### Option 2: Azure App Service

1. **Create App Service Plan**
```bash
az appservice plan create \
  --name budget-ai-plan \
  --resource-group budget-ai-rg \
  --sku B1 \
  --is-linux
```

2. **Create Web App for Backend**
```bash
az webapp create \
  --resource-group budget-ai-rg \
  --plan budget-ai-plan \
  --name budget-ai-backend \
  --deployment-local-git
```

3. **Configure Environment Variables**
```bash
az webapp config appsettings set \
  --resource-group budget-ai-rg \
  --name budget-ai-backend \
  --settings \
    MONGODB_URL="your-mongodb-connection-string" \
    DATABASE_NAME="budget_ai" \
    SECRET_KEY="your-secret-key"
```

### Google Cloud Deployment

#### Option 1: Google Cloud Run

1. **Enable APIs**
```bash
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

2. **Build and Deploy Backend**
```bash
# Build image
gcloud builds submit --tag gcr.io/$PROJECT_ID/budget-ai-backend ./server

# Deploy to Cloud Run
gcloud run deploy budget-ai-backend \
  --image gcr.io/$PROJECT_ID/budget-ai-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URL="your-mongodb-connection-string",DATABASE_NAME="budget_ai",SECRET_KEY="your-secret-key"
```

3. **Build and Deploy Frontend**
```bash
# Build image
gcloud builds submit --tag gcr.io/$PROJECT_ID/budget-ai-frontend ./client

# Deploy to Cloud Run
gcloud run deploy budget-ai-frontend \
  --image gcr.io/$PROJECT_ID/budget-ai-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Option 2: Google App Engine

1. **Create app.yaml for Backend**
```yaml
runtime: python311
entrypoint: uvicorn app.main:app --host 0.0.0.0 --port $PORT

env_variables:
  MONGODB_URL: "your-mongodb-connection-string"
  DATABASE_NAME: "budget_ai"
  SECRET_KEY: "your-secret-key"

automatic_scaling:
  target_cpu_utilization: 0.65
  min_instances: 1
  max_instances: 10
```

2. **Deploy**
```bash
gcloud app deploy app.yaml
```

## 🗄️ Database Deployment

### MongoDB Atlas (Cloud)

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create free cluster
   - Choose cloud provider and region

2. **Configure Network Access**
   - Add IP addresses or `0.0.0.0/0` for all access
   - Create database user with read/write permissions

3. **Get Connection String**
   - Copy connection string from Atlas dashboard
   - Replace `<password>` with actual password
   - Update environment variables

### Self-Hosted MongoDB

1. **Install MongoDB**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Windows
# Download from mongodb.com
```

2. **Start MongoDB Service**
```bash
# Ubuntu/Debian
sudo systemctl start mongodb
sudo systemctl enable mongodb

# macOS
brew services start mongodb-community
```

3. **Create Database and User**
```bash
mongosh
use budget_ai
db.createUser({
  user: "budget_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

## 🔧 Environment Configuration

### Production Environment Variables

Create `.env.production`:
```env
# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/budget_ai
DATABASE_NAME=budget_ai

# Security
SECRET_KEY=your-super-secure-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API
API_V1_STR=/api/v1
PROJECT_NAME=Budget AI API

# Environment
ENVIRONMENT=production
DEBUG=false

# CORS
BACKEND_CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend Environment Variables

Create `client/.env.production`:
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
```

## 📊 Monitoring and Logging

### Application Monitoring

1. **Health Checks**
   - Endpoint: `/health`
   - Response time monitoring
   - Database connectivity checks

2. **Logging**
   - Structured logging with JSON format
   - Log levels: DEBUG, INFO, WARNING, ERROR
   - Centralized log aggregation

3. **Metrics**
   - Request/response counts
   - Response times
   - Error rates
   - Database query performance

### Cloud Monitoring

#### AWS CloudWatch
```bash
# Create log group
aws logs create-log-group --log-group-name /aws/ecs/budget-ai

# Create metric filter
aws logs put-metric-filter \
  --log-group-name /aws/ecs/budget-ai \
  --filter-name ErrorCount \
  --filter-pattern "ERROR" \
  --metric-transformations metricName=ErrorCount,metricNamespace=BudgetAI,metricValue=1
```

#### Azure Monitor
```bash
# Enable diagnostic settings
az monitor diagnostic-settings create \
  --resource-group budget-ai-rg \
  --resource-type Microsoft.Web/sites \
  --resource-name budget-ai-backend \
  --name budget-ai-diagnostics \
  --storage-account budgetaistorage \
  --logs '[{"category": "AppServiceHTTPLogs", "enabled": true}]'
```

## 🔒 Security Configuration

### SSL/TLS Configuration

1. **Obtain SSL Certificate**
   - Let's Encrypt (free)
   - Cloud provider certificates
   - Custom certificates

2. **Configure HTTPS**
   - Redirect HTTP to HTTPS
   - HSTS headers
   - Secure cookie settings

### Security Headers

```python
# Add to FastAPI app
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["yourdomain.com"])
app.add_middleware(HTTPSRedirectMiddleware)
```

### Rate Limiting

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/api/transactions")
@limiter.limit("100/minute")
async def get_transactions(request: Request):
    # Your code here
    pass
```

## 📈 Scaling Configuration

### Horizontal Scaling

1. **Load Balancer**
   - Distribute traffic across multiple instances
   - Health checks for instance health
   - Auto-scaling based on metrics

2. **Database Scaling**
   - Read replicas for read operations
   - Sharding for large datasets
   - Connection pooling

### Auto-scaling Policies

#### AWS ECS Auto-scaling
```json
{
  "autoScalingGroupName": "budget-ai-asg",
  "minSize": 1,
  "maxSize": 10,
  "desiredCapacity": 2,
  "targetTrackingPolicies": [
    {
      "targetValue": 70.0,
      "predefinedMetricSpecification": {
        "predefinedMetricType": "ECSServiceAverageCPUUtilization"
      }
    }
  ]
}
```

## 🚨 Backup and Recovery

### Database Backups

1. **Automated Backups**
   - Daily full backups
   - Hourly incremental backups
   - Point-in-time recovery

2. **Backup Storage**
   - Multiple regions
   - Cross-account access
   - Encryption at rest

### Application Backups

1. **Configuration Backups**
   - Environment variables
   - Configuration files
   - SSL certificates

2. **Code Backups**
   - Git repository
   - Container images
   - Deployment scripts

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy Budget AI

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd server
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd server
          pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          # Your deployment commands here
          echo "Deploying to production..."
```

### GitLab CI

Create `.gitlab-ci.yml`:
```yaml
stages:
  - test
  - deploy

test:
  stage: test
  image: python:3.11
  script:
    - cd server
    - pip install -r requirements.txt
    - pytest

deploy:
  stage: deploy
  script:
    - echo "Deploying to production..."
  only:
    - main
```

## 📝 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance testing done
- [ ] Database migrations ready
- [ ] Environment variables configured
- [ ] SSL certificates obtained
- [ ] Monitoring configured

### Deployment
- [ ] Database backup completed
- [ ] Application deployed
- [ ] Health checks passing
- [ ] SSL configured
- [ ] Monitoring active
- [ ] Logs flowing

### Post-deployment
- [ ] Smoke tests passed
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] User acceptance testing
- [ ] Documentation updated
- [ ] Team notified

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failures**
   - Check connection string
   - Verify network access
   - Check credentials

2. **High Response Times**
   - Database query optimization
   - Connection pooling
   - Caching implementation

3. **Memory Issues**
   - Increase container memory
   - Optimize code
   - Add monitoring

### Debug Commands

```bash
# Check application logs
docker logs container_name

# Check database connectivity
mongosh "your-connection-string"

# Test API endpoints
curl -X GET "https://your-api.com/health"

# Check resource usage
docker stats
```

---

**Deployment Guide Version**: 1.0  
**Last Updated**: December 2024  
**Coverage**: AWS, Azure, Google Cloud, Docker  
**Status**: Production Ready
