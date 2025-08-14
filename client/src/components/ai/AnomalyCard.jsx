import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

const AnomalyCard = ({ anomaly, onViewDetails }) => {
  const getAnomalyIcon = (type) => {
    switch (type) {
      case 'spending_spike':
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case 'unusual_category':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'amount_deviation':
        return <DollarSign className="w-5 h-5 text-blue-500" />;
      case 'frequency_change':
        return <TrendingDown className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAnomalyTypeLabel = (type) => {
    switch (type) {
      case 'spending_spike':
        return 'Spending Spike';
      case 'unusual_category':
        return 'Unusual Category';
      case 'amount_deviation':
        return 'Amount Deviation';
      case 'frequency_change':
        return 'Frequency Change';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getAnomalyIcon(anomaly.anomaly_type)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {getAnomalyTypeLabel(anomaly.anomaly_type)}
              </h3>
              <p className="text-sm text-gray-600">{anomaly.category}</p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(anomaly.severity)}`}>
            {anomaly.severity.toUpperCase()}
          </span>
        </div>

        {/* Amount and Date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-2xl font-bold text-gray-900">
              ${Math.abs(anomaly.amount).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(anomaly.date)}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-2">
          {anomaly.description}
        </p>

        {/* Confidence Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Confidence Score</span>
            <span className="font-medium text-gray-900">
              {((anomaly.confidence_score || 0) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(anomaly.confidence_score || 0) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Explanation */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Why this is unusual:</h4>
          <p className="text-sm text-gray-600 line-clamp-3">
            {anomaly.explanation || 'No explanation available'}
          </p>
        </div>

        {/* Recommendation */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendation:</h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {anomaly.recommendation || 'No recommendation available'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => onViewDetails?.(anomaly)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            View Details
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors duration-200">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnomalyCard;
