import React from 'react'
import { TrendingUp } from 'lucide-react'

const ForecastCard = ({ forecast }) => {
  return (
    <div className="card p-6 border-l-4 border-l-purple-500 bg-purple-50">
      <div className="flex items-start space-x-3">
        <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {forecast.title || 'Spending Forecast'}
          </h4>
          <p className="text-gray-700 mb-3">
            {forecast.description || 'AI predicts your future spending based on historical patterns.'}
          </p>
          <div className="space-y-2">
            {forecast.predictedAmount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Predicted Amount:</span>
                <span className="font-medium">${forecast.predictedAmount}</span>
              </div>
            )}
            {forecast.timeframe && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Timeframe:</span>
                <span className="font-medium">{forecast.timeframe}</span>
              </div>
            )}
            {forecast.confidence && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Confidence:</span>
                <span className="font-medium">{forecast.confidence}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForecastCard
