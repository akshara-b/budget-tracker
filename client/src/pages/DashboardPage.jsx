import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTransactions, fetchTransactionSummary } from '../store/slices/transactionSlice.js'
import { fetchBudgets, fetchBudgetProgress } from '../store/slices/budgetSlice.js'
import { fetchFinancialInsights } from '../store/slices/aiSlice.js'
import StatCard from '../components/dashboard/StatCard.jsx'
import SpendingChart from '../components/dashboard/SpendingChart.jsx'
import RecentTransactions from '../components/dashboard/RecentTransactions.jsx'
import BudgetProgress from '../components/dashboard/BudgetProgress.jsx'
import AIInsightsCard from '../components/dashboard/AIInsightsCard.jsx'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const { summary, isLoading: transactionsLoading } = useSelector((state) => state.transactions)
  const { progress, isLoading: budgetsLoading } = useSelector((state) => state.budgets)
  const { insights, isLoading: aiLoading } = useSelector((state) => state.ai)

  useEffect(() => {
    dispatch(fetchTransactionSummary())
    dispatch(fetchBudgetProgress())
    dispatch(fetchFinancialInsights())
  }, [dispatch])

  const isLoading = transactionsLoading || budgetsLoading || aiLoading

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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={summary?.total_income || 0}
          change="+12.5%"
          changeType="positive"
          icon="income"
        />
        <StatCard
          title="Total Expenses"
          value={summary?.total_expenses || 0}
          change="+8.2%"
          changeType="negative"
          icon="expense"
        />
        <StatCard
          title="Net Amount"
          value={summary?.net_amount || 0}
          change="+15.3%"
          changeType="positive"
          icon="net"
        />
        <StatCard
          title="Transactions"
          value={summary?.transaction_count || 0}
          change="+5.1%"
          changeType="positive"
          icon="transaction"
        />
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Overview</h3>
          <SpendingChart />
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
