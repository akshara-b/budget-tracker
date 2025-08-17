import React from 'react'
import { TrendingUp, TrendingDown, Calendar, Target, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '../../utils/currency.js'

const ForecastCard = ({ forecast }) => {
  // Format currency values
  const formatCurrencyValue = (amount) => {
    if (typeof amount === 'number') {
      return formatCurrency(amount)
    }
    return amount || formatCurrency(0)
  }

  // Get trend icon and color
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
      case 'upward':
        return <TrendingUp className="w-5 h-5 text-red-600 mt-0.5" />
      case 'decreasing':
      case 'downward':
        return <TrendingDown className="w-5 h-5 text-green-600 mt-0.5" />
      default:
        return <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'increasing':
      case 'upward':
        return 'border-l-red-500 bg-red-50'
      case 'decreasing':
      case 'downward':
        return 'border-l-green-500 bg-green-50'
      default:
        return 'border-l-purple-500 bg-purple-50'
    }
  }

  // Get confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get confidence badge
  const getConfidenceBadge = (confidence) => {
    let level = 'Medium'
    let colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200'
    
    if (confidence >= 80) {
      level = 'High'
      colorClass = 'bg-green-100 text-green-800 border-green-200'
    } else if (confidence < 60) {
      level = 'Low'
      colorClass = 'bg-red-100 text-red-800 border-red-200'
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
        {level} Confidence
      </span>
    )
  }

  return (
    <div className={`card p-6 border-l-4 ${getTrendColor(forecast.trend)}`}>
      <div className="flex items-start space-x-3">
        {getTrendIcon(forecast.trend)}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-semibold text-gray-900">
              {forecast.title || forecast.category || 'Spending Forecast'}
            </h4>
            {forecast.confidence && getConfidenceBadge(forecast.confidence)}
          </div>
          
          <p className="text-gray-700 mb-4">
            {forecast.description || forecast.insight || 'AI predicts your future spending based on historical patterns.'}
          </p>
          
          <div className="space-y-3">
            {(forecast.predicted_amount || forecast.predictedAmount) && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Predicted Amount:</span>
                <span className="font-medium text-purple-700">
                  {formatCurrencyValue(forecast.predicted_amount || forecast.predictedAmount)}
                </span>
              </div>
            )}
            
            {forecast.timeframe && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Timeframe:</span>
                <span className="font-medium text-gray-900">{forecast.timeframe}</span>
              </div>
            )}
            
            {forecast.current_average && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Average:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrencyValue(forecast.current_average)}
                </span>
              </div>
            )}
            
            {forecast.trend_change && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Expected Change:</span>
                <span className={`font-medium ${forecast.trend === 'increasing' ? 'text-red-600' : 'text-green-600'}`}>
                  {forecast.trend_change > 0 ? '+' : ''}{forecast.trend_change}%
                </span>
              </div>
            )}
            
            {forecast.confidence && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Confidence:</span>
                <span className={`font-medium ${getConfidenceColor(forecast.confidence)}`}>
                  {forecast.confidence}%
                </span>
              </div>
            )}
          </div>
          
          {forecast.factors && forecast.factors.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Key Factors
              </h5>
              <ul className="space-y-1">
                {forecast.factors.slice(0, 3).map((factor, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {forecast.recommendations && forecast.recommendations.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h5 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Recommendations
              </h5>
              <ul className="space-y-1">
                {forecast.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForecastCard
