import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTransactions, fetchTransactionSummary } from '../store/slices/transactionSlice.js'
import { fetchBudgets, fetchBudgetProgress } from '../store/slices/budgetSlice.js'
import { fetchFinancialInsights } from '../store/slices/aiSlice.js'
import { fetchFinancialSummary } from '../store/slices/reportSlice.js'
import StatCard from '../components/dashboard/StatCard.jsx'
import SpendingChart from '../components/dashboard/SpendingChart.jsx'
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx'
import BudgetProgress from '../components/dashboard/BudgetProgress.jsx'
import AIInsightsCard from '../components/dashboard/AIInsightsCard.jsx'
import { formatCurrency } from '../utils/currency.js'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const { summary, isLoading: transactionsLoading, error: transactionsError } = useSelector((state) => state.transactions)
  const { progress, isLoading: budgetsLoading, error: budgetsError } = useSelector((state) => state.budgets)
  const { insights, isLoading: aiLoading, error: aiError } = useSelector((state) => state.ai)
  const { financialSummary, isLoading: reportsLoading, error: reportsError } = useSelector((state) => state.reports)

  useEffect(() => {
    dispatch(fetchTransactions())
    dispatch(fetchTransactionSummary())
    dispatch(fetchBudgetProgress())
    dispatch(fetchFinancialInsights())
    dispatch(fetchFinancialSummary())
  }, [dispatch])

  const isLoading = transactionsLoading || budgetsLoading || aiLoading || reportsLoading
  const hasErrors = transactionsError || budgetsError || aiError || reportsError

  // Debug logging
  console.log('Dashboard State:', {
    summary,
    progress,
    insights,
    financialSummary,
    isLoading,
    hasErrors,
    transactionsError,
    budgetsError,
    aiError,
    reportsError
  })
  
  // Additional debug for AI insights
  console.log('Dashboard AI insights details:', insights)
  
  // Additional debug for progress data
  console.log('Progress data details:', progress)

  if (hasErrors) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800">Dashboard Errors</h3>
          {transactionsError && <p className="text-red-700">Transactions: {transactionsError}</p>}
          {budgetsError && <p className="text-red-700">Budgets: {budgetsError}</p>}
          {aiError && <p className="text-red-700">AI Insights: {aiError}</p>}
          {reportsError && <p className="text-red-700">Reports: {reportsError}</p>}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header with gradient */}
      <div className="card-gradient">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your finances.</p>
        </div>
      </div>

      {/* Stats Grid with enhanced cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Income</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(summary?.total_income || 0)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(summary?.total_expenses || 0)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Net Balance</h3>
              <p className={`text-2xl font-bold ${(summary?.net_balance || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {formatCurrency(summary?.net_balance || 0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="stat-card group">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Transactions</h3>
              <p className="text-2xl font-bold text-purple-600">{summary?.transaction_count || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

        {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-gradient">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="p-2 bg-blue-100 rounded-lg mr-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            Spending Overview
          </h3>
          <SpendingChart monthlyData={financialSummary?.monthly_trends || []} />
        </div>
        
        <div className="card-gradient">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="p-2 bg-green-100 rounded-lg mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </span>
            Recent Transactions
          </h3>
          <RecentTransactions />
        </div>
      </div>

      {/* Budget Progress and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-premium">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="p-2 bg-indigo-100 rounded-lg mr-3">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            Budget Progress
          </h3>
          <BudgetProgress />
        </div>
        
        <div className="card-premium">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="p-2 bg-purple-100 rounded-lg mr-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            AI Insights
          </h3>
          <AIInsightsCard insights={insights} isLoading={aiLoading} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
