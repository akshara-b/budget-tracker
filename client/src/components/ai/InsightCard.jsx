import React from 'react'
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Zap } from 'lucide-react'

const InsightCard = ({ insight }) => {
  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-600" />
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'tip':
        return <Lightbulb className="w-5 h-5 text-blue-600" />
      default:
        return <Zap className="w-5 h-5 text-purple-600" />
    }
  }

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive':
        return 'border-l-green-500 bg-green-50'
      case 'negative':
        return 'border-l-red-500 bg-red-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'tip':
        return 'border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-purple-500 bg-purple-50'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`card p-6 border-l-4 ${getInsightColor(insight.type || 'tip')}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getInsightIcon(insight.type || 'tip')}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold text-gray-900">
              {insight.title || 'Financial Insight'}
            </h4>
            {insight.priority && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)} Priority
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-3">
            {insight.description || 'AI-generated financial advice based on your spending patterns.'}
          </p>
          
          {insight.recommendation && (
            <div className="bg-white bg-opacity-70 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-gray-800 mb-1">💡 Recommendation:</p>
              <p className="text-sm text-gray-700">{insight.recommendation}</p>
            </div>
          )}
          
          {insight.impact && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Potential Impact:</span>
              <span className={`font-medium ${
                insight.impact === 'high' ? 'text-red-600' :
                insight.impact === 'medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)}
              </span>
            </div>
          )}
          
          {insight.confidence && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">AI Confidence:</span>
                <span className="font-medium text-gray-900">{insight.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${insight.confidence}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InsightCard
