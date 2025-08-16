import api from './api.js'

export const aiService = {
  async getFinancialInsights(params = {}) {
    const response = await api.get('/ai/insights', { params })
    return response.data
  },

  async getAnomalies(params = {}) {
    const response = await api.get('/ai/anomalies', { params })
    return response.data
  },

  async getSpendingPatterns(params = {}) {
    const response = await api.get('/ai/spending-patterns', { params })
    return response.data
  },

  async getBudgetRecommendations(params = {}) {
    const response = await api.get('/ai/budget-recommendations', { params })
    return response.data
  },

  async getSpendingForecast(params = {}) {
    const response = await api.get('/ai/predictions/spending-forecast', { params })
    return response.data
  },

  async analyzeTransaction(transactionData) {
    const response = await api.post('/ai/analyze-transaction', transactionData)
    return response.data
  },

  async getCategoryInsights(category, params = {}) {
    const response = await api.get(`/ai/category/${category}/insights`, { params })
    return response.data
  },

  async getPersonalizedAdvice(params = {}) {
    const response = await api.get('/ai/advice', { params })
    return response.data
  },

  async generateReport(reportType, params = {}) {
    const response = await api.post(`/ai/reports/${reportType}`, params)
    return response.data
  },

  async getRiskAssessment(params = {}) {
    const response = await api.get('/ai/risk-assessment', { params })
    return response.data
  },

  async getSavingsSuggestions(params = {}) {
    const response = await api.get('/ai/savings-suggestions', { params })
    return response.data
  },

  // New method for getting comprehensive AI insights
  async getComprehensiveInsights(params = {}) {
    try {
      const [insights, anomalies, patterns, recommendations, forecasts] = await Promise.allSettled([
        this.getFinancialInsights(params),
        this.getAnomalies(params),
        this.getSpendingPatterns(params),
        this.getBudgetRecommendations(params),
        this.getSpendingForecast(params)
      ])

      return {
        insights: insights.status === 'fulfilled' ? insights.value : [],
        anomalies: anomalies.status === 'fulfilled' ? anomalies.value : [],
        patterns: patterns.status === 'fulfilled' ? patterns.value : [],
        recommendations: recommendations.status === 'fulfilled' ? recommendations.value : [],
        forecasts: forecasts.status === 'fulfilled' ? forecasts.value : []
      }
    } catch (error) {
      console.error('Error fetching comprehensive insights:', error)
      throw error
    }
  }
}
