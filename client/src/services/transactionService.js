import api from './api.js'

export const transactionService = {
  async getTransactions(params = {}) {
    const response = await api.get('/transactions', { params })
    return response.data
  },

  async getTransaction(id) {
    const response = await api.get(`/transactions/${id}`)
    return response.data
  },

  async createTransaction(transactionData) {
    const response = await api.post('/transactions', transactionData)
    return response.data
  },

  async updateTransaction(id, transactionData) {
    const response = await api.put(`/transactions/${id}`, transactionData)
    return response.data
  },

  async deleteTransaction(id) {
    const response = await api.delete(`/transactions/${id}`)
    return response.data
  },

  async getTransactionSummary(params = {}) {
    const response = await api.get('/transactions/summary', { params })
    return response.data
  },

  async getTransactionsByCategory(category, params = {}) {
    const response = await api.get(`/transactions/category/${category}`, { params })
    return response.data
  },

  async getTransactionsByDateRange(startDate, endDate, params = {}) {
    const response = await api.get('/transactions/date-range', {
      params: { start_date: startDate, end_date: endDate, ...params }
    })
    return response.data
  },

  async exportTransactions(format = 'csv', params = {}) {
    const response = await api.get(`/transactions/export/${format}`, { params })
    return response.data
  }
}
