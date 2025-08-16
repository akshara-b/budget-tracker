import React from 'react'
import { Target } from 'lucide-react'

const RecommendationCard = ({ recommendation }) => {
  // Format the recommended amount for display
  const formatAmount = (amount) => {
    if (typeof amount === 'number') {
      return amount.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    }
    return amount
  }

  // Get confidence level color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get confidence level text
  const getConfidenceText = (confidence) => {
    if (confidence >= 0.8) return 'High Confidence'
    if (confidence >= 0.6) return 'Medium Confidence'
    return 'Low Confidence'
  }

  return (
    <div className="card p-6 border-l-4 border-l-green-500 bg-green-50">
      <div className="flex items-start space-x-3">
        <Target className="w-5 h-5 text-green-600 mt-0.5" />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-lg font-semibold text-gray-900">
              {recommendation.category || 'Budget Recommendation'}
            </h4>
            {recommendation.confidence && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white ${getConfidenceColor(recommendation.confidence)}`}>
                {getConfidenceText(recommendation.confidence)}
              </span>
            )}
          </div>
          
          <p className="text-gray-700 mb-4">
            {recommendation.reasoning || recommendation.description || 'AI suggests an adjustment to your budget based on your spending patterns.'}
          </p>
          
          <div className="space-y-3">
            {recommendation.category && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-900">{recommendation.category}</span>
              </div>
            )}
            
            {(recommendation.recommended_amount || recommendation.suggestedAmount) && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Recommended Budget:</span>
                <span className="font-medium text-green-700">
                  {formatAmount(recommendation.recommended_amount || recommendation.suggestedAmount)}
                </span>
              </div>
            )}
            
            {recommendation.confidence && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Confidence:</span>
                <span className="font-medium text-gray-900">{(recommendation.confidence * 100).toFixed(0)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationCard
