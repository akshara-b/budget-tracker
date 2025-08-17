import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBudgets, fetchBudgetProgress, createBudget, updateBudget, deleteBudget } from '../store/slices/budgetSlice.js'
import { Plus, Search, Edit, Trash2, PlusCircle, Target, Calendar } from 'lucide-react'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'
import BudgetForm from '../components/budgets/BudgetForm.jsx'
import BudgetModal from '../components/budgets/BudgetModal.jsx'
import { formatCurrency } from '../utils/currency.js'

const BudgetsPage = () => {
  const dispatch = useDispatch()
  const { budgets, progress, isLoading } = useSelector((state) => state.budgets)
  
  const [showForm, setShowForm] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  useEffect(() => {
    dispatch(fetchBudgets())
    dispatch(fetchBudgetProgress())
  }, [dispatch])

  const handleCreateBudget = async (budgetData) => {
    try {
      await dispatch(createBudget(budgetData)).unwrap()
      setShowForm(false)
      // Refresh budgets
      dispatch(fetchBudgets())
    } catch (error) {
      console.error('Failed to create budget:', error)
    }
  }

  const handleUpdateBudget = async (id, budgetData) => {
    try {
      await dispatch(updateBudget({ id, data: budgetData })).unwrap()
      setSelectedBudget(null)
      setShowModal(false)
      // Refresh budgets
      dispatch(fetchBudgets())
    } catch (error) {
      console.error('Failed to update budget:', error)
    }
  }

  const handleDeleteBudget = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await dispatch(deleteBudget(id)).unwrap()
        // Refresh budgets
        dispatch(fetchBudgets())
      } catch (error) {
        console.error('Failed to delete budget:', error)
      }
    }
  }

  const filteredBudgets = budgets?.filter(budget => {
    const matchesSearch = budget.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         budget.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || budget.category === filterCategory
    
    return matchesSearch && matchesCategory
  }) || []

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getProgressPercentage = (spent, limit) => {
    if (!limit || limit === 0) return 0
    return Math.min((spent / limit) * 100, 100)
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600">Manage your spending limits and track progress</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary mt-4 sm:mt-0 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search budgets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        
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
          <option value="Housing">Housing</option>
          <option value="Education">Education</option>
        </select>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBudgets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-2">
              <PlusCircle className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">No budgets found</p>
            <p className="text-sm text-gray-400">Create your first budget to get started</p>
          </div>
        ) : (
          filteredBudgets.map((budget) => {
            // Find corresponding progress data
            const progressData = progress?.find(p => 
              p.budget_id === budget.id || 
              p.category === budget.category
            )
            
            // Use the correct field names
            const budgetAmount = budget.amount || 0
            const spentAmount = progressData?.spent_amount || 0
            const remainingAmount = budgetAmount - spentAmount
            const progressPercentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0
            const progressColor = getProgressColor(progressPercentage)
            
            return (
              <div key={budget.id || budget._id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{budget.category}</h3>
                      <p className="text-sm text-gray-600">{budget.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBudget(budget)
                        setShowModal(true)
                      }}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.id || budget._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Budget Amount:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(budgetAmount)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Spent:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(spentAmount)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Remaining:</span>
                    <span className={`font-semibold ${remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(remainingAmount)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-sm font-medium text-gray-900">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Start: {formatDate(budget.start_date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>End: {formatDate(budget.end_date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Budget Form Modal */}
      {showForm && (
        <BudgetForm
          onSubmit={handleCreateBudget}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Budget View/Edit Modal */}
      {showModal && selectedBudget && (
        <BudgetModal
          budget={selectedBudget}
          onUpdate={handleUpdateBudget}
          onClose={() => {
            setShowModal(false)
            setSelectedBudget(null)
          }}
        />
      )}
    </div>
  )
}

export default BudgetsPage
