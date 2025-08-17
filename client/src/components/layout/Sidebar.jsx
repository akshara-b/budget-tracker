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
        fixed inset-y-0 left-0 z-30 w-64 bg-white/70 backdrop-blur-md shadow-xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Gradient overlay that matches header and main background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-indigo-50/80 to-purple-50/80"></div>
        
        {/* Close button for mobile */}
        <div className="relative flex items-center justify-between p-4 border-b border-white/20 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={closeSidebar}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative mt-8 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-white/60 hover:text-gray-900 hover:shadow-md'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                  <span>{item.name}</span>
                </NavLink>
              )
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-green-200 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-700" />
                  </div>
                  <div>
                    <p className="text-xs text-green-600 font-medium">Income</p>
                    <p className="text-sm text-green-800 font-bold">{formatCurrency(summary?.total_income)}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-red-200 rounded-lg">
                    <TrendingDown className="w-4 h-4 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs text-red-600 font-medium">Expenses</p>
                    <p className="text-sm text-red-800 font-bold">{formatCurrency(summary?.total_expenses)}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-blue-200 rounded-lg">
                    <PieChart className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Balance</p>
                    <p className="text-sm text-blue-800 font-bold">{formatCurrency(summary?.net_balance)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
