import React from 'react'
import { BarChart3 } from 'lucide-react'

const PatternCard = ({ pattern }) => {
  return (
    <div className="card p-6 border-l-4 border-l-blue-500 bg-blue-50">
      <div className="flex items-start space-x-3">
        <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            {pattern.title || 'Spending Pattern Identified'}
          </h4>
          <p className="text-gray-700 mb-3">
            {pattern.description || 'AI has identified a recurring pattern in your spending behavior.'}
          </p>
          <div className="space-y-2">
            {pattern.category && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{pattern.category}</span>
              </div>
            )}
            {pattern.frequency && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frequency:</span>
                <span className="font-medium">{pattern.frequency}</span>
              </div>
            )}
            {pattern.trend && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Trend:</span>
                <span className="font-medium capitalize">{pattern.trend}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatternCard
