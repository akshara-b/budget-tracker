import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Save } from 'lucide-react'

const BudgetForm = ({ onSubmit, onCancel, budget }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: budget || {
      category: '',
      limit: 0,
      period: 'monthly',
      description: ''
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
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {budget ? 'Edit Budget' : 'Create Budget'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
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

          {/* Limit */}
          <div>
            <label className="form-label">Budget Limit *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('limit', { 
                required: 'Budget limit is required',
                min: { value: 0.01, message: 'Budget limit must be greater than 0' }
              })}
              className={`input-field ${errors.limit ? 'border-red-500' : ''}`}
              placeholder="0.00"
            />
            {errors.limit && (
              <p className="text-red-500 text-sm mt-1">{errors.limit.message}</p>
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
              onClick={onCancel}
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
                  Saving...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Save className="w-4 h-4 mr-2" />
                  {budget ? 'Update' : 'Create'}
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BudgetForm
