import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBudgetProgress } from '../../store/slices/budgetSlice.js'
import { Target, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '../../utils/currency.js'

const BudgetProgress = () => {
  const { progress } = useSelector((state) => state.budgets)

  const getProgressPercentage = (spent, limit) => {
    if (!limit || limit === 0) return 0
    return Math.min((spent / limit) * 100, 100)
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getProgressTextColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (!progress || progress.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No budgets to track</p>
        <p className="text-sm text-gray-400">Create some budgets to see progress here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {progress.map((budget) => {
        // More defensive data access
        const budgetAmount = budget.budget_amount || budget.amount || 0
        const spentAmount = budget.spent_amount || budget.spent || 0
        
        const progressPercentage = getProgressPercentage(spentAmount, budgetAmount)
        const progressColor = getProgressColor(progressPercentage)
        const progressTextColor = getProgressTextColor(progressPercentage)
        
        return (
          <div key={budget.budget_id || budget.id || budget._id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">{budget.category}</span>
              </div>
              <span className={`text-sm font-semibold ${progressTextColor}`}>
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Spent: {formatCurrency(spentAmount)}</span>
              <span>Budget: {formatCurrency(budgetAmount)}</span>
            </div>
            
            {progressPercentage > 100 && (
              <div className="flex items-center space-x-1 text-red-600 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>Over budget by {formatCurrency(spentAmount - budgetAmount)}</span>
              </div>
            )}
            
            {progressPercentage >= 75 && progressPercentage <= 100 && (
              <div className="flex items-center space-x-1 text-yellow-600 text-xs">
                <TrendingUp className="w-3 h-3" />
                <span>Approaching budget limit</span>
              </div>
            )}
          </div>
        )
      })}
      
      <div className="text-center pt-2">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Budgets
        </button>
      </div>
    </div>
  )
}

export default BudgetProgress
