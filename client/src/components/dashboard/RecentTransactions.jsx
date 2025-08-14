import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions } from '../../store/slices/transactionSlice.js'
import { ArrowUpRight, ArrowDownLeft, Eye } from 'lucide-react'

const RecentTransactions = () => {
  const dispatch = useDispatch()
  const { transactions } = useSelector((state) => state.transactions)

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  const recentTransactions = transactions?.slice(0, 5) || []

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getTransactionIcon = (type) => {
    return type === 'income' ? (
      <ArrowDownLeft className="w-4 h-4 text-green-600" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-600" />
    )
  }

  const getTransactionColor = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600'
  }

  if (recentTransactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recent transactions</p>
        <p className="text-sm text-gray-400">Add some transactions to see them here</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {recentTransactions.map((transaction) => (
        <div key={transaction.id || transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              {getTransactionIcon(transaction.transaction_type)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
              <p className="text-xs text-gray-600">{transaction.category}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-semibold ${getTransactionColor(transaction.transaction_type)}`}>
              {transaction.transaction_type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </span>
            <span className="text-xs text-gray-500">{formatDate(transaction.date)}</span>
            <button className="text-gray-400 hover:text-gray-600">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-2">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Transactions
        </button>
      </div>
    </div>
  )
}

export default RecentTransactions
