import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Save } from 'lucide-react'

const TransactionForm = ({ onSubmit, onCancel, transaction }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: transaction || {
      description: '',
      amount: 0,
      category: '',
      transaction_type: 'expense',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    }
  })

  const categories = [
    'Food & Dining',
    'Transportation',
    'Entertainment',
    'Shopping',
    'Healthcare',
    'Utilities',
    'Salary',
    'Investment',
    'Other'
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
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
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
          {/* Description */}
          <div>
            <label className="form-label">Description *</label>
            <input
              type="text"
              {...register('description', { required: 'Description is required' })}
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter transaction description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="form-label">Amount *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('amount', { 
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' }
              })}
              className={`input-field ${errors.amount ? 'border-red-500' : ''}`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Transaction Type */}
          <div>
            <label className="form-label">Type *</label>
            <select
              {...register('transaction_type', { required: 'Transaction type is required' })}
              className="input-field"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="form-label">Category *</label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="input-field"
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

          {/* Date */}
          <div>
            <label className="form-label">Date *</label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className={`input-field ${errors.date ? 'border-red-500' : ''}`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="form-label">Notes</label>
            <textarea
              {...register('notes')}
              rows={3}
              className="input-field"
              placeholder="Optional notes about this transaction"
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
                  {transaction ? 'Update' : 'Save'}
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionForm
