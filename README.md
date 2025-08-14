# Budget AI - Intelligent Personal Finance Management

A full-stack web application that combines traditional budgeting tools with AI-powered financial insights, anomaly detection, and predictive analytics to help users make smarter financial decisions.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication system
- **Transaction Management**: Track income and expenses with categorization
- **Budget Planning**: Create and monitor budgets by category
- **Financial Reports**: Generate detailed financial summaries and PDF reports
- **Data Visualization**: Interactive charts and graphs for financial analysis

### AI-Powered Features
- **Intelligent Insights**: AI-generated financial recommendations and insights
- **Anomaly Detection**: Identify unusual spending patterns automatically
- **Spending Pattern Analysis**: Understand your financial behavior trends
- **Budget Recommendations**: AI-suggested budget adjustments based on spending patterns
- **Spending Forecasts**: Predictive analytics for future financial planning

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs with Python
- **MongoDB**: NoSQL database for flexible data storage
- **Motor**: Async MongoDB driver for Python
- **Pydantic**: Data validation using Python type annotations
- **JWT**: Secure authentication with JSON Web Tokens
- **Pandas & Scikit-learn**: Data analysis and machine learning
- **ReportLab**: PDF generation for financial reports

### Frontend
- **React 19**: Modern React with latest features
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Beautiful and composable charts
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing

## 📁 Project Structure

```
budget-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store configuration
│   │   ├── services/      # API service functions
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── server/                 # FastAPI backend
│   ├── app/
│   │   ├── routers/       # API route handlers
│   │   ├── config.py      # Configuration settings
│   │   ├── db.py          # Database connection
│   │   └── main.py        # FastAPI application
│   └── requirements.txt   # Python dependencies
├── docs/                   # Documentation and diagrams
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd budget-ai
   ```

2. **Set up Python environment**
   ```bash
   cd server
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start the backend server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Database Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=budget_ai

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Budget AI API

# Environment
ENVIRONMENT=development
DEBUG=true

# CORS Origins
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Transactions
- `GET /transactions` - List transactions
- `POST /transactions` - Create transaction
- `GET /transactions/{id}` - Get transaction
- `PUT /transactions/{id}` - Update transaction
- `DELETE /transactions/{id}` - Delete transaction
- `GET /transactions/summary/overview` - Transaction summary

### Budgets
- `GET /budgets` - List budgets
- `POST /budgets` - Create budget
- `GET /budgets/{id}` - Get budget
- `PUT /budgets/{id}` - Update budget
- `DELETE /budgets/{id}` - Delete budget
- `GET /budgets/progress/overview` - Budget progress

### Reports
- `GET /reports/summary` - Financial summary
- `GET /reports/spending-by-category` - Category analysis
- `GET /reports/monthly-trends` - Monthly trends
- `GET /reports/export/pdf` - Export PDF report

### AI Features
- `GET /ai/insights` - Financial insights
- `GET /ai/anomalies` - Anomaly detection
- `GET /ai/spending-patterns` - Spending patterns
- `GET /ai/budget-recommendations` - Budget recommendations
- `GET /ai/predictions/spending-forecast` - Spending forecasts

## 🤖 AI Tools Used

This project leverages several AI and machine learning techniques:

### 1. **Statistical Analysis**
- **Z-score Analysis**: For anomaly detection in spending patterns
- **Trend Analysis**: Linear regression for spending forecasts
- **Pattern Recognition**: Identifying spending habits and cycles

### 2. **Machine Learning Libraries**
- **Pandas**: Data manipulation and analysis
- **Scikit-learn**: Machine learning algorithms
- **NumPy**: Numerical computing

### 3. **AI-Powered Features**
- **Anomaly Detection**: Identifies unusual transactions using statistical methods
- **Spending Pattern Analysis**: Analyzes user behavior patterns
- **Predictive Analytics**: Forecasts future spending based on historical data
- **Intelligent Insights**: Generates actionable financial recommendations

### 4. **Natural Language Processing**
- **Smart Categorization**: Suggests transaction categories
- **Insight Generation**: Creates human-readable financial insights

## 🧪 Testing

### Backend Testing
```bash
cd server
pytest
```

### Frontend Testing
```bash
cd client
npm test
```

## 📈 Deployment

### Backend Deployment
1. **Build the application**
   ```bash
   cd server
   pip install -r requirements.txt
   ```

2. **Set production environment variables**
   ```bash
   export ENVIRONMENT=production
   export DEBUG=false
   export SECRET_KEY=<your-production-secret>
   ```

3. **Run with production server**
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Frontend Deployment
1. **Build for production**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy the `dist/` folder to your hosting service**

## 🌐 Cloud Deployment Options

### Azure
- Use Azure App Service for the backend
- Azure Cosmos DB for MongoDB
- Azure Static Web Apps for the frontend

### AWS
- AWS Lambda + API Gateway for the backend
- Amazon DocumentDB for MongoDB
- AWS S3 + CloudFront for the frontend

### Google Cloud
- Google Cloud Run for the backend
- MongoDB Atlas for the database
- Google Cloud Storage for the frontend

## 📚 Documentation

- **API Documentation**: Available at `/docs` when running the backend
- **Architecture Diagrams**: Located in `/docs/diagrams/`
- **Wireframes**: Located in `/docs/wireframes/`
- **Test Reports**: Located in `/docs/test-report.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI community for the excellent web framework
- MongoDB team for the flexible database solution
- React team for the powerful frontend library
- All contributors and users of this project

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in `/docs/`
- Review the API documentation at `/docs`

---

**Built with ❤️ using AI-powered development tools**
