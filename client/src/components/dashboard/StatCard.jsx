import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, CreditCard, PiggyBank, BarChart3 } from 'lucide-react'

const StatCard = ({ title, value, change, changeType, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'income':
        return <TrendingUp className="w-6 h-6 text-green-600" />
      case 'expense':
        return <TrendingDown className="w-6 h-6 text-red-600" />
      case 'net':
        return <DollarSign className="w-6 h-6 text-blue-600" />
      case 'transaction':
        return <CreditCard className="w-6 h-6 text-purple-600" />
      case 'savings':
        return <PiggyBank className="w-6 h-6 text-green-600" />
      default:
        return <BarChart3 className="w-6 h-6 text-gray-600" />
    }
  }

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(val)
    }
    return val
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg">
          {getIcon()}
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </span>
          <span className="text-sm text-gray-600 ml-2">from last month</span>
        </div>
      )}
    </div>
  )
}

export default StatCard
