import api from './api.js'

export const budgetService = {
  async getBudgets(params = {}) {
    const response = await api.get('/budgets', { params })
    return response.data
  },

  async getBudget(id) {
    const response = await api.get(`/budgets/${id}`)
    return response.data
  },

  async createBudget(budgetData) {
    const response = await api.post('/budgets', budgetData)
    return response.data
  },

  async updateBudget(id, budgetData) {
    const response = await api.put(`/budgets/${id}`, budgetData)
    return response.data
  },

  async deleteBudget(id) {
    const response = await api.delete(`/budgets/${id}`)
    return response.data
  },

  async getBudgetProgress(params = {}) {
    const response = await api.get('/budgets/progress', { params })
    return response.data
  },

  async getBudgetByCategory(category, params = {}) {
    const response = await api.get(`/budgets/category/${category}`, { params })
    return response.data
  },

  async getBudgetHistory(id, params = {}) {
    const response = await api.get(`/budgets/${id}/history`, { params })
    return response.data
  },

  async exportBudgets(format = 'csv', params = {}) {
    const response = await api.get(`/budgets/export/${format}`, { params })
    return response.data
  }
}
