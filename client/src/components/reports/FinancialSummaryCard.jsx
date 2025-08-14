import React from 'react'
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react'

const FinancialSummaryCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon,
  valueColor = 'text-gray-900'
}) => {
  const getChangeIcon = () => {
    if (changeType === 'positive') {
      return <TrendingUpIcon className="w-4 h-4 text-green-600" />
    }
    return <TrendingDownIcon className="w-4 h-4 text-red-600" />
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        {getChangeIcon()}
        <span className={`ml-1 text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
        <span className="ml-1 text-sm text-gray-500">from last period</span>
      </div>
    </div>
  )
}

export default FinancialSummaryCard
