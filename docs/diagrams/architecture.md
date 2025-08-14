# Budget AI - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (React 19 + Redux + Tailwind CSS + Recharts)   │
│  - User Interface Components                                   │
│  - State Management (Redux Toolkit)                            │
│  - Data Visualization (Charts & Graphs)                        │
│  - Responsive Design (Mobile & Desktop)                        │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  FastAPI Backend                                                │
│  - RESTful API Endpoints                                        │
│  - Request/Response Validation                                  │
│  - CORS & Security Headers                                      │
│  - Rate Limiting & Throttling                                  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Internal Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  Router Modules                                                 │
│  ├── Authentication Router (JWT, bcrypt)                       │
│  ├── Transactions Router (CRUD operations)                     │
│  ├── Budgets Router (Budget management)                        │
│  ├── Reports Router (Financial analytics)                      │
│  └── AI Router (ML insights & predictions)                     │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Data Processing
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI/ML LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  Machine Learning Components                                    │
│  ├── Pandas (Data manipulation)                                │
│  ├── Scikit-learn (ML algorithms)                              │
│  ├── NumPy (Numerical computing)                               │
│  ├── Anomaly Detection (Z-score analysis)                      │
│  ├── Pattern Recognition (Spending trends)                      │
│  └── Predictive Analytics (Forecasting)                        │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Data Persistence
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB Database                                               │
│  ├── Users Collection (Authentication data)                    │
│  ├── Transactions Collection (Financial records)               │
│  ├── Budgets Collection (Budget plans)                         │
│  └── Indexes (Performance optimization)                        │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

```
User Action → Frontend → API Gateway → Business Logic → AI/ML → Database
    ↑                                                                  │
    └────────────────── Response Flow ←───────────────────────────────┘
```

### Detailed Data Flow

1. **User Interaction**
   - User performs action in React frontend
   - Redux store manages application state
   - API service functions handle HTTP requests

2. **API Gateway**
   - FastAPI receives HTTP requests
   - CORS middleware handles cross-origin requests
   - Request validation using Pydantic models

3. **Business Logic**
   - Router modules process business logic
   - Authentication middleware validates JWT tokens
   - Data validation and business rules enforcement

4. **AI/ML Processing**
   - Pandas processes transaction data
   - Scikit-learn algorithms analyze patterns
   - Statistical analysis for insights generation

5. **Data Persistence**
   - Motor (async MongoDB driver) handles database operations
   - Optimized queries using database indexes
   - Transaction management and error handling

## 🏛️ Component Architecture

### Frontend Components

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorBoundary.tsx
│   ├── forms/
│   │   ├── TransactionForm.tsx
│   │   ├── BudgetForm.tsx
│   │   └── LoginForm.tsx
│   ├── charts/
│   │   ├── SpendingChart.tsx
│   │   ├── BudgetProgress.tsx
│   │   └── TrendChart.tsx
│   └── dashboard/
│       ├── Overview.tsx
│       ├── RecentTransactions.tsx
│       └── AIInsights.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── Budgets.tsx
│   ├── Reports.tsx
│   └── AIInsights.tsx
├── store/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── transactionSlice.ts
│   │   └── budgetSlice.ts
│   └── store.ts
└── services/
    ├── api.ts
    ├── authService.ts
    └── transactionService.ts
```

### Backend Components

```
server/app/
├── routers/
│   ├── auth.py          # Authentication endpoints
│   ├── transactions.py  # Transaction management
│   ├── budgets.py       # Budget management
│   ├── reports.py       # Financial reporting
│   └── ai.py           # AI/ML features
├── models/
│   ├── user.py          # User data models
│   ├── transaction.py   # Transaction models
│   └── budget.py        # Budget models
├── services/
│   ├── auth_service.py  # Authentication logic
│   ├── ai_service.py    # AI/ML processing
│   └── report_service.py # Report generation
├── config.py            # Configuration settings
├── db.py               # Database connection
└── main.py             # FastAPI application
```

## 🔐 Security Architecture

### Authentication Flow

```
1. User Registration
   User → Frontend → POST /auth/register → Backend → Database

2. User Login
   User → Frontend → POST /auth/login → Backend → JWT Token

3. Protected Requests
   Frontend → JWT Token → Backend → Token Validation → Response
```

### Security Features

- **JWT Tokens**: Secure authentication with expiration
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Controlled cross-origin access
- **Input Validation**: Pydantic models for data validation
- **User Isolation**: Users can only access their own data
- **Rate Limiting**: Protection against abuse

## 📊 Database Architecture

### MongoDB Collections

```
budget_ai/
├── users/
│   ├── _id: ObjectId
│   ├── username: String (unique)
│   ├── email: String (unique)
│   ├── full_name: String
│   ├── hashed_password: String
│   └── created_at: DateTime
├── transactions/
│   ├── _id: ObjectId
│   ├── user_id: ObjectId (ref: users)
│   ├── amount: Number
│   ├── description: String
│   ├── category: String
│   ├── transaction_type: String (income/expense)
│   ├── date: DateTime
│   ├── tags: Array[String]
│   ├── created_at: DateTime
│   └── updated_at: DateTime
├── budgets/
│   ├── _id: ObjectId
│   ├── user_id: ObjectId (ref: users)
│   ├── name: String
│   ├── amount: Number
│   ├── category: String
│   ├── period: String (monthly/weekly/yearly)
│   ├── start_date: DateTime
│   ├── end_date: DateTime
│   ├── description: String
│   ├── created_at: DateTime
│   └── updated_at: DateTime
```

### Database Indexes

```javascript
// Performance optimization indexes
db.users.createIndex({"username": 1}, {unique: true})
db.users.createIndex({"email": 1}, {unique: true})
db.transactions.createIndex([{"user_id": 1}, {"date": -1}])
db.transactions.createIndex([{"user_id": 1}, {"category": 1}])
db.transactions.createIndex([{"user_id": 1}, {"transaction_type": 1}])
db.budgets.createIndex([{"user_id": 1}, {"category": 1}])
```

## 🚀 Deployment Architecture

### Development Environment

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Dev     │    │  FastAPI Dev    │    │  MongoDB Local  │
│   (Port 5173)   │◄──►│   (Port 8000)   │◄──►│   (Port 27017)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRODUCTION                              │
├─────────────────────────────────────────────────────────────────┤
│  Load Balancer (Nginx/Cloud Load Balancer)                     │
│  ├── Frontend (Static hosting - S3, CloudFront, etc.)          │
│  └── Backend (Container/Server - ECS, App Service, etc.)       │
├─────────────────────────────────────────────────────────────────┤
│  Backend Services                                               │
│  ├── FastAPI Application (Container/VM)                        │
│  ├── MongoDB (Atlas, DocumentDB, CosmosDB)                     │
│  └── Redis (Session caching, optional)                         │
├─────────────────────────────────────────────────────────────────┤
│  Monitoring & Logging                                           │
│  ├── Application Insights / CloudWatch                          │
│  ├── Log aggregation (ELK Stack)                                │
│  └── Performance monitoring                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 🔧 Technology Stack Details

### Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Web Framework** | FastAPI | 0.111.0 | High-performance API framework |
| **Database Driver** | Motor | 3.5.1 | Async MongoDB driver |
| **Data Validation** | Pydantic | 2.8.2 | Data models and validation |
| **Authentication** | PyJWT + bcrypt | 2.8.0 + 4.1.2 | JWT tokens and password hashing |
| **Data Analysis** | Pandas | 2.2.2 | Data manipulation and analysis |
| **Machine Learning** | Scikit-learn | 1.5.1 | ML algorithms and predictions |
| **PDF Generation** | ReportLab | 4.2.2 | Financial report generation |
| **Testing** | Pytest | 8.3.2 | Unit and integration testing |

### Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **UI Framework** | React | 19.1.1 | Component-based UI library |
| **State Management** | Redux Toolkit | 2.8.2 | Centralized state management |
| **Styling** | Tailwind CSS | 4.1.12 | Utility-first CSS framework |
| **Charts** | Recharts | 3.1.2 | Data visualization components |
| **Build Tool** | Vite | 5.4.19 | Fast build tool and dev server |
| **Routing** | React Router | 6.30.1 | Client-side routing |
| **HTTP Client** | Axios | 1.11.0 | API communication |

## 📈 Scalability Considerations

### Horizontal Scaling

- **Stateless Backend**: FastAPI applications can be scaled horizontally
- **Database Sharding**: MongoDB supports horizontal scaling
- **Load Balancing**: Multiple backend instances behind load balancer
- **CDN**: Static assets served from CDN for global performance

### Performance Optimization

- **Database Indexing**: Optimized queries for common operations
- **Caching**: Redis for session and data caching
- **Async Operations**: Non-blocking I/O operations
- **Connection Pooling**: Efficient database connection management

### Monitoring & Observability

- **Health Checks**: API health monitoring endpoints
- **Metrics Collection**: Performance and business metrics
- **Logging**: Structured logging for debugging and analysis
- **Alerting**: Automated alerts for system issues

---

**Architecture Version**: 1.0  
**Last Updated**: December 2024  
**Status**: Production Ready
