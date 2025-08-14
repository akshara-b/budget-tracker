import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { X, Save, Edit, Eye } from 'lucide-react'

const TransactionModal = ({ transaction, onUpdate, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      transaction_type: transaction.transaction_type,
      date: new Date(transaction.date).toISOString().split('T')[0],
      notes: transaction.notes || ''
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
      await onUpdate(transaction._id, data)
    } catch (error) {
      console.error('Update error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTransactionIcon = (type) => {
    return type === 'income' ? '↓' : '↑'
  }

  const getTransactionColor = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Transaction' : 'Transaction Details'}
          </h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-900 p-1"
                title="Edit transaction"
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
            {/* Transaction Header */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <span className={`text-2xl font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                {getTransactionIcon(transaction.transaction_type)}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{transaction.description}</h3>
                <p className="text-sm text-gray-500 capitalize">{transaction.transaction_type}</p>
              </div>
            </div>

            {/* Amount */}
            <div className="text-center p-4">
              <p className="text-sm text-gray-600 mb-1">Amount</p>
              <p className={`text-3xl font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                {transaction.transaction_type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{transaction.category}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">{formatDate(transaction.date)}</span>
              </div>
              
              {transaction.notes && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Notes</span>
                  <span className="font-medium text-right max-w-xs">{transaction.notes}</span>
                </div>
              )}
              
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{formatDate(transaction.created_at || transaction.date)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionModal
