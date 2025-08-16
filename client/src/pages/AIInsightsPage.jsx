import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchAnomalies, fetchSpendingPatterns, fetchBudgetRecommendations, fetchSpendingForecast } from '../store/slices/aiSlice.js'
import { Brain, AlertTriangle, TrendingUp, Target, BarChart3, Lightbulb, Zap, Eye } from 'lucide-react'
import AnomalyCard from '../components/ai/AnomalyCard.jsx'
import PatternCard from '../components/ai/PatternCard.jsx'
import RecommendationCard from '../components/ai/RecommendationCard.jsx'
import ForecastCard from '../components/ai/ForecastCard.jsx'
import LoadingSpinner from '../components/common/LoadingSpinner.jsx'

const AIInsightsPage = () => {
  const dispatch = useDispatch()
  const { anomalies, patterns, recommendations, forecasts, isLoading } = useSelector((state) => state.ai)
  
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedAnomaly, setSelectedAnomaly] = useState(null)

  useEffect(() => {
    dispatch(fetchAnomalies())
    dispatch(fetchSpendingPatterns())
    dispatch(fetchBudgetRecommendations())
    dispatch(fetchSpendingForecast())
  }, [dispatch])

  // Debug logging
  console.log('AI Insights Page State:', {
    anomalies,
    patterns,
    recommendations,
    forecasts,
    isLoading
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Brain },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
    { id: 'patterns', label: 'Patterns', icon: BarChart3 },
    { id: 'recommendations', label: 'Recommendations', icon: Target },
    { id: 'forecasts', label: 'Forecasts', icon: TrendingUp }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* AI Summary */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">AI Financial Assistant</h3>
            <p className="text-gray-600">
              Your personal AI has analyzed {anomalies?.length || 0} spending patterns and identified {anomalies?.length || 0} anomalies to help you make better financial decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="p-3 bg-red-100 rounded-lg mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{anomalies?.length || 0}</h4>
          <p className="text-sm text-gray-600">Anomalies Detected</p>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-blue-100 rounded-lg mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{patterns?.length || 0}</h4>
          <p className="text-sm text-gray-600">Patterns Identified</p>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-green-100 rounded-lg mx-auto mb-3">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{recommendations?.length || 0}</h4>
          <p className="text-sm text-gray-600">Recommendations</p>
        </div>

        <div className="card text-center">
          <div className="p-3 bg-purple-100 rounded-lg mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{forecasts?.length || 0}</h4>
          <p className="text-sm text-gray-600">Forecasts Generated</p>
        </div>
      </div>

      {/* Recent Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Anomalies */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Anomalies</h3>
            <button
              onClick={() => setActiveTab('anomalies')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {anomalies?.slice(0, 3).map((anomaly) => (
              <div key={anomaly.id || anomaly._id} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{anomaly.category}</p>
                  <p className="text-xs text-gray-600">{anomaly.description}</p>
                </div>
                <button
                  onClick={() => setSelectedAnomaly(anomaly)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!anomalies || anomalies.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">No anomalies detected</p>
            )}
          </div>
        </div>

        {/* Recent Recommendations */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Recommendations</h3>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recommendations?.slice(0, 3).map((recommendation) => (
              <div key={recommendation.id || recommendation._id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Target className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{recommendation.category}</p>
                  <p className="text-xs text-gray-600">{recommendation.description}</p>
                </div>
              </div>
            ))}
            {(!recommendations || recommendations.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">No recommendations available</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Tips */}
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Tips for Better Financial Health</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Review your spending patterns weekly to identify trends</p>
              <p>• Set up alerts for unusual spending in specific categories</p>
              <p>• Use the forecast feature to plan for upcoming expenses</p>
              <p>• Regularly check budget recommendations for optimization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnomalies = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Spending Anomalies</h2>
        <p className="text-gray-600">AI-detected unusual spending patterns that may need your attention</p>
      </div>

      {anomalies?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {anomalies.map((anomaly) => (
            <AnomalyCard
              key={anomaly.id || anomaly._id}
              anomaly={anomaly}
              onViewDetails={setSelectedAnomaly}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Anomalies Detected</h3>
          <p className="text-gray-600">Great job! Your spending patterns look normal.</p>
        </div>
      )}
    </div>
  )

  const renderPatterns = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Spending Patterns</h2>
        <p className="text-gray-600">AI-identified recurring patterns in your financial behavior</p>
      </div>

      {patterns?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {patterns.map((pattern) => (
            <PatternCard key={pattern.id || pattern._id} pattern={pattern} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Patterns Identified</h3>
          <p className="text-gray-600">Add more transactions to discover spending patterns.</p>
        </div>
      )}
    </div>
  )

  const renderRecommendations = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Budget Recommendations</h2>
        <p className="text-gray-600">AI-suggested improvements to optimize your budget</p>
      </div>

      {recommendations?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id || recommendation._id} recommendation={recommendation} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Available</h3>
          <p className="text-gray-600">Add more data to receive personalized budget recommendations.</p>
        </div>
      )}
    </div>
  )

  const renderForecasts = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Spending Forecasts</h2>
        <p className="text-gray-600">AI-predicted future spending based on your historical data</p>
      </div>

      {forecasts?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {forecasts.map((forecast) => (
            <ForecastCard key={forecast.id || forecast._id} forecast={forecast} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Forecasts Available</h3>
          <p className="text-gray-600">Add more transaction history to generate spending forecasts.</p>
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'anomalies':
        return renderAnomalies()
      case 'patterns':
        return renderPatterns()
      case 'recommendations':
        return renderRecommendations()
      case 'forecasts':
        return renderForecasts()
      default:
        return renderOverview()
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-gray-600">Discover intelligent insights about your financial behavior</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderContent()}

      {/* Anomaly Detail Modal */}
      {selectedAnomaly && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Anomaly Details</h3>
                <button
                  onClick={() => setSelectedAnomaly(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AnomalyCard anomaly={selectedAnomaly} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIInsightsPage
