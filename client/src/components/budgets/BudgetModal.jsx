import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Save, Edit, Target, Calendar, Coins } from 'lucide-react'
import { formatCurrency } from '../../utils/currency.js'

const BudgetModal = ({ budget, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      description: budget.description || ''
    }
  })

  const categories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Utilities',
    'Housing',
    'Education',
    'Other'
  ]

  const periods = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ]

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await onUpdate(budget.id, data)
    } catch (error) {
      console.error('Update error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProgressPercentage = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100)
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100'
    if (percentage >= 75) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getStatusText = (percentage) => {
    if (percentage >= 100) return 'Over Budget'
    if (percentage >= 90) return 'Critical'
    if (percentage >= 75) return 'Warning'
    return 'On Track'
  }

  const percentage = getProgressPercentage(budget.spent || 0, budget.amount)
  const remaining = budget.amount - (budget.spent || 0)

  return (
    <div className="fixed inset-0 bg-black/20 flex items-start justify-center z-[9999] p-4 pt-8 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Budget' : 'Budget Details'}
          </h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-900 p-1"
                title="Edit budget"
              >
                <Edit className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
            {/* Category */}
            <div>
              <label className="form-label">Category *</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className={`input-field ${errors.category ? 'border-red-500' : ''}`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="form-label">Budget Amount *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('amount', { 
                  required: 'Budget amount is required',
                  min: { value: 0.01, message: 'Budget amount must be greater than 0' }
                })}
                className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>

            {/* Period */}
            <div>
              <label className="form-label">Budget Period *</label>
              <select
                {...register('period', { required: 'Budget period is required' })}
                className="input-field"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description</label>
              <textarea
                {...register('description')}
                rows={3}
                className="input-field"
                placeholder="Optional description for this budget"
              />
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Save className="w-4 h-4 mr-2" />
                    Update
                  </div>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="p-6 space-y-4">
            {/* Budget Header */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                <p className="text-sm text-gray-500 capitalize">{budget.period} budget</p>
              </div>
            </div>

            {/* Budget Amounts */}
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center">
                  <Coins className="w-4 h-4 mr-2" />
                  Amount
                </span>
                <span className="font-medium">{formatCurrency(budget.amount)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Spent</span>
                <span className="font-medium">{formatCurrency(budget.spent || 0)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Remaining</span>
                <span className={`font-medium ${remaining < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {remaining < 0 ? `-${formatCurrency(Math.abs(remaining))}` : formatCurrency(remaining)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Progress</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(percentage)}`}>
                  {getStatusText(percentage)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                {percentage.toFixed(1)}% used
              </p>
            </div>

            {/* Additional Details */}
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Period
                </span>
                <span className="font-medium capitalize">{budget.period}</span>
              </div>
              
              {budget.description && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Description</span>
                  <span className="font-medium text-right max-w-xs">{budget.description}</span>
                </div>
              )}
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">
                  {new Date(budget.created_at || budget.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BudgetModal
