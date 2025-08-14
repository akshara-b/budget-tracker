import React from 'react'
import { Brain, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react'

const AIInsightsCard = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No AI insights available</p>
        <p className="text-sm text-gray-400">Add more data to receive personalized insights</p>
      </div>
    )
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'savings':
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'tip':
        return <Lightbulb className="w-5 h-5 text-blue-600" />
      default:
        return <Brain className="w-5 h-5 text-purple-600" />
    }
  }

  const getInsightColor = (type) => {
    switch (type) {
      case 'savings':
        return 'bg-green-50 border-green-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'tip':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-purple-50 border-purple-200'
    }
  }

  return (
    <div className="space-y-4">
      {insights.slice(0, 3).map((insight) => (
        <div
          key={insight.id || insight._id}
          className={`p-4 rounded-lg border ${getInsightColor(insight.type || 'default')}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getInsightIcon(insight.type || 'default')}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {insight.title || 'AI Insight'}
              </h4>
              <p className="text-sm text-gray-700">
                {insight.description || 'AI has identified an important pattern in your finances.'}
              </p>
              {insight.action && (
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Action:</strong> {insight.action}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {insights.length > 3 && (
        <div className="text-center pt-2">
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Insights
          </button>
        </div>
      )}
    </div>
  )
}

export default AIInsightsCard
