import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { setSidebarOpen } from '../../store/slices/uiSlice.js'
import { fetchTransactionSummary } from '../../store/slices/transactionSlice.js'
import { formatCurrency } from '../../utils/currency.js'
import { 
  Home, 
  CreditCard, 
  Target, 
  BarChart3, 
  Brain, 
  Settings, 
  X,
  TrendingUp,
  TrendingDown,
  PieChart
} from 'lucide-react'

const Sidebar = () => {
  const dispatch = useDispatch()
  const { sidebarOpen } = useSelector((state) => state.ui)
  const { summary } = useSelector((state) => state.transactions)
  const location = useLocation()

  // Fetch transaction summary for quick stats
  useEffect(() => {
    if (!summary) {
      dispatch(fetchTransactionSummary())
    }
  }, [dispatch, summary])

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Transactions', href: '/transactions', icon: CreditCard },
    { name: 'Budgets', href: '/budgets', icon: Target },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'AI Insights', href: '/ai-insights', icon: Brain },
  ]

  const closeSidebar = () => {
    dispatch(setSidebarOpen(false))
  }

  const isActive = (href) => {
    return location.pathname === href
  }

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                    ${isActive(item.href)
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive(item.href) ? 'text-blue-700' : 'text-gray-500'}`} />
                  <span>{item.name}</span>
                </NavLink>
              )
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="px-3 py-2 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">Income: {formatCurrency(summary?.total_income)}</span>
                </div>
              </div>
              <div className="px-3 py-2 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">Expenses: {formatCurrency(summary?.total_expenses)}</span>
                </div>
              </div>
              <div className="px-3 py-2 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <PieChart className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700">Net: {formatCurrency(summary?.net_balance)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <NavLink
              to="/settings"
              onClick={closeSidebar}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            >
              <Settings className="w-5 h-5 text-gray-500" />
              <span>Settings</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
