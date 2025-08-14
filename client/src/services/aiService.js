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
    const response = await api.get('/ai/patterns', { params })
    return response.data
  },

  async getBudgetRecommendations(params = {}) {
    const response = await api.get('/ai/recommendations', { params })
    return response.data
  },

  async getSpendingForecast(params = {}) {
    const response = await api.get('/ai/forecast', { params })
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
  }
}
