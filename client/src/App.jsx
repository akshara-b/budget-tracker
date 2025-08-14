import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from './store/store.js'
import { fetchCurrentUser } from './store/slices/authSlice.js'
import { fetchTransactions } from './store/slices/transactionSlice.js'
import { fetchBudgets } from './store/slices/budgetSlice.js'
import { fetchFinancialInsights } from './store/slices/aiSlice.js'
import Layout from './components/layout/Layout.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import BudgetsPage from './pages/BudgetsPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import AIInsightsPage from './pages/AIInsightsPage.jsx'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Public Route Component (redirects if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

const App = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage)
    const token = localStorage.getItem('token')
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    // Load initial data when user is authenticated
    if (isAuthenticated && user) {
      dispatch(fetchTransactions())
      dispatch(fetchBudgets())
      dispatch(fetchFinancialInsights())
    }
  }, [dispatch, isAuthenticated, user])

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="budgets" element={<BudgetsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="ai-insights" element={<AIInsightsPage />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
