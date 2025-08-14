import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from '../store/slices/transactionSlice.js'
import { Plus, Search, Filter, Edit, Trash2, Eye, PlusCircle } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import TransactionForm from '../components/transactions/TransactionForm.jsx'
import TransactionModal from '../components/transactions/TransactionModal.jsx'

const TransactionsPage = () => {
  const dispatch = useDispatch()
  const { transactions, isLoading } = useSelector((state) => state.transactions)
  
  const [showForm, setShowForm] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    dispatch(fetchTransactions())
  }, [dispatch])

  const handleCreateTransaction = async (transactionData) => {
    try {
      await dispatch(createTransaction(transactionData)).unwrap()
      setShowForm(false)
      // Refresh transactions
      dispatch(fetchTransactions())
    } catch (error) {
      console.error('Failed to create transaction:', error)
    }
  }

  const handleUpdateTransaction = async (id, transactionData) => {
    try {
      await dispatch(updateTransaction({ id, data: transactionData })).unwrap()
      setSelectedTransaction(null)
      setShowModal(false)
      // Refresh transactions
      dispatch(fetchTransactions())
    } catch (error) {
      console.error('Failed to update transaction:', error)
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await dispatch(deleteTransaction(id)).unwrap()
        // Refresh transactions
        dispatch(fetchTransactions())
      } catch (error) {
        console.error('Failed to delete transaction:', error)
      }
    }
  }

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory
    
    return matchesSearch && matchesType && matchesCategory
  }) || []

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getTransactionIcon = (type) => {
    return type === 'income' ? '↓' : '↑'
  }

  const getTransactionColor = (type) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600'
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Manage your income and expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="input-field"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="input-field"
        >
          <option value="all">All Categories</option>
          <option value="Food & Dining">Food & Dining</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Utilities">Utilities</option>
          <option value="Salary">Salary</option>
          <option value="Investment">Investment</option>
        </select>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-400 mb-2">
                      <PlusCircle className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-500">No transactions found</p>
                    <p className="text-sm text-gray-400">Add your first transaction to get started</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id || transaction._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-lg font-bold mr-2 ${getTransactionColor(transaction.transaction_type)}`}>
                          {getTransactionIcon(transaction.transaction_type)}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.description}
                          </div>
                          <div className="text-sm text-gray-500">
                            {transaction.transaction_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm font-semibold ${getTransactionColor(transaction.transaction_type)}`}>
                        {transaction.transaction_type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction)
                            setShowModal(true)
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id || transaction._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <TransactionForm
          onSubmit={handleCreateTransaction}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Transaction View/Edit Modal */}
      {showModal && selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onUpdate={handleUpdateTransaction}
          onClose={() => {
            setShowModal(false)
            setSelectedTransaction(null)
          }}
        />
      )}
    </div>
  )
}

export default TransactionsPage
