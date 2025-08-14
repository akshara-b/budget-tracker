import React from 'react'
import { Target } from 'lucide-react'

const RecommendationCard = ({ recommendation }) => {
  return (
    <div className="card p-6 border-l-4 border-l-green-500 bg-green-50">
      <div className="flex items-start space-x-3">
        <Target className="w-5 h-5 text-green-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {recommendation.title || 'Budget Recommendation'}
          </h4>
          <p className="text-gray-700 mb-3">
            {recommendation.description || 'AI suggests an adjustment to your budget based on your spending patterns.'}
          </p>
          <div className="space-y-2">
            {recommendation.category && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{recommendation.category}</span>
              </div>
            )}
            {recommendation.suggestedAmount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Suggested Amount:</span>
                <span className="font-medium">${recommendation.suggestedAmount}</span>
              </div>
            )}
            {recommendation.reason && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Reason:</span>
                <span className="font-medium">{recommendation.reason}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecommendationCard
