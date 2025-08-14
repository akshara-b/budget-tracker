# Budget AI - React Frontend

This is the React frontend for the Budget AI application, providing an intuitive user interface for personal finance management with AI-powered insights.

## Features

- **Dashboard**: Overview of financial health with charts and statistics
- **Transactions**: Manage income and expenses with full CRUD operations
- **Budgets**: Set and track spending limits with visual progress indicators
- **Reports**: Financial analytics and spending pattern visualization
- **AI Insights**: AI-generated financial recommendations and anomaly detection

## Technology Stack

- **React 19**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **React Hook Form**: Form management and validation
- **Lucide React**: Icon library
- **Vite**: Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

```bash
npm test
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ai/             # AI-related components
│   ├── common/         # Common components (LoadingSpinner, etc.)
│   ├── dashboard/      # Dashboard-specific components
│   ├── layout/         # Layout components (Header, Sidebar, Layout)
│   ├── reports/        # Report and chart components
│   ├── transactions/   # Transaction-related components
│   └── budgets/        # Budget-related components
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   └── ...             # Main application pages
├── services/           # API service layer
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Components

### Dashboard Components
- `StatCard`: Displays financial statistics with trends
- `SpendingChart`: Visualizes spending data with charts
- `RecentTransactions`: Shows recent transaction history
- `BudgetProgress`: Displays budget progress with visual indicators
- `AIInsightsCard`: Shows AI-generated financial insights

### Transaction Management
- `TransactionForm`: Form for adding/editing transactions
- `TransactionModal`: Modal for viewing/editing transaction details
- `TransactionsPage`: Main transactions management page

### Budget Management
- `BudgetForm`: Form for creating/editing budgets
- `BudgetModal`: Modal for viewing/editing budget details
- `BudgetsPage`: Main budgets management page

### Reports & Analytics
- `FinancialSummaryCard`: Displays financial summary information
- `SpendingByCategoryChart`: Pie chart for category spending
- `MonthlyTrendsChart`: Bar chart for monthly trends
- `ReportsPage`: Main reports and analytics page

### AI Insights
- `InsightCard`: Displays AI-generated financial insights
- `AnomalyCard`: Shows detected spending anomalies
- `PatternCard`: Displays identified spending patterns
- `RecommendationCard`: Shows budget recommendations
- `ForecastCard`: Displays spending forecasts
- `AIInsightsPage`: Main AI insights page with tabs

## State Management

The application uses Redux Toolkit for state management with the following slices:

- **auth**: Authentication state (user, token, login status)
- **transactions**: Transaction data and operations
- **budgets**: Budget data and progress tracking
- **ai**: AI insights, anomalies, patterns, and forecasts
- **ui**: UI state (sidebar, theme, loading states)

## API Integration

The frontend communicates with the FastAPI backend through:

- **Base API Service**: Configured Axios instance with interceptors
- **Service Modules**: Dedicated services for each domain (auth, transactions, budgets, AI)
- **Redux Thunks**: Async actions for API calls and state updates

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable component classes defined in `index.css`
- **Responsive Design**: Mobile-first responsive design approach
- **Theme Support**: Light/dark theme toggle (prepared for future implementation)

## Development

### Code Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Type safety and better development experience
- **Prettier**: Code formatting (configured through ESLint)

### Testing
- **Jest**: Testing framework
- **React Testing Library**: Component testing utilities
- **Test Coverage**: Unit tests for components and utilities

## Deployment

The application can be deployed to any static hosting service:

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables for production API endpoints

## Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Budget AI
```

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Write tests for new components
4. Follow the established naming conventions
5. Ensure responsive design for all new components

## Troubleshooting

### Common Issues

1. **Port already in use**: Change the port in `vite.config.ts`
2. **TypeScript errors**: Run `npm run build` to see compilation errors
3. **Missing dependencies**: Run `npm install` to install missing packages
4. **API connection issues**: Check backend server and CORS configuration

### Development Tips

- Use the Redux DevTools browser extension for debugging state
- Check the browser console for API errors and warnings
- Use the Network tab to debug API calls
- Test responsive design using browser dev tools

## License

This project is part of the Budget AI application.
