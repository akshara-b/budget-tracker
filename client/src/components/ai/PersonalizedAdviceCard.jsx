import React from 'react'
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'

const PersonalizedAdviceCard = ({ advice }) => {
  const getAdviceIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'trend_up':
        return <TrendingUp className="w-5 h-5 text-blue-600" />
      case 'trend_down':
        return <TrendingDown className="w-5 h-5 text-red-600" />
      default:
        return <Lightbulb className="w-5 h-5 text-yellow-600" />
    }
  }

  const getAdviceColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-l-orange-500 bg-orange-50'
      case 'success':
        return 'border-l-green-500 bg-green-50'
      case 'trend_up':
        return 'border-l-blue-500 bg-blue-50'
      case 'trend_down':
        return 'border-l-red-500 bg-red-50'
      default:
        return 'border-l-yellow-500 bg-yellow-50'
    }
  }

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colors[priority] || colors.medium}`}>
        {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium'} Priority
      </span>
    )
  }

  return (
    <div className={`card p-6 border-l-4 ${getAdviceColor(advice.type)}`}>
      <div className="flex items-start space-x-3">
        {getAdviceIcon(advice.type)}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-semibold text-gray-900">
              {advice.title || 'Personalized Advice'}
            </h4>
            {advice.priority && getPriorityBadge(advice.priority)}
          </div>
          
          <p className="text-gray-700 mb-4">
            {advice.description || advice.message || 'AI has some personalized advice for your financial health.'}
          </p>
          
          {advice.actionItems && advice.actionItems.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-900 mb-2">Recommended Actions:</h5>
              <ul className="space-y-1">
                {advice.actionItems.map((item, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-between items-center text-xs text-gray-500">
            {advice.category && (
              <span className="bg-gray-100 px-2 py-1 rounded-full">
                {advice.category}
              </span>
            )}
            {advice.confidence && (
              <span>
                Confidence: {(advice.confidence * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalizedAdviceCard