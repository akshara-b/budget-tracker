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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your finances.</p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Income</h3>
            <p className="text-2xl font-bold">{formatCurrency(summary?.total_income || 0)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Total Expenses</h3>
            <p className="text-2xl font-bold">{formatCurrency(summary?.total_expenses || 0)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Net Amount</h3>
            <p className="text-2xl font-bold">{formatCurrency(summary?.net_balance || 0)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium">Transactions</h3>
            <p className="text-2xl font-bold">{summary?.transaction_count || 0}</p>
          </div>
        </div>

        {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Overview</h3>
          <SpendingChart monthlyData={financialSummary?.monthly_trends || []} />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <RecentTransactions />
        </div>
      </div>

      {/* Budget Progress and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Progress</h3>
          <BudgetProgress />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights</h3>
          <AIInsightsCard insights={insights} isLoading={aiLoading} />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
