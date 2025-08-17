import api from './api.js'

export const reportService = {
  async getFinancialSummary(params = {}) {
    const response = await api.get('/reports/summary', { params })
    return response.data
  },

  async getSpendingByCategory(params = {}) {
    const response = await api.get('/reports/spending-by-category', { params })
    return response.data
  },

  async getMonthlyTrends(params = {}) {
    const response = await api.get('/reports/monthly-trends', { params })
    return response.data
  },

  async exportReport(format = 'pdf', params = {}) {
    const response = await api.get(`/reports/export/${format}`, { params })
    return response.data
  }
}
