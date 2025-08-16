import api from './api.js'

export const authService = {
  async login(credentials) {
    // Convert to FormData for OAuth2PasswordRequestForm compatibility
    const formData = new FormData()
    formData.append('username', credentials.email) // Backend expects username but we use email
    formData.append('password', credentials.password)
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh')
    return response.data
  },

  async changePassword(passwordData) {
    const response = await api.post('/auth/change-password', passwordData)
    return response.data
  },

  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  async resetPassword(resetData) {
    const response = await api.post('/auth/reset-password', resetData)
    return response.data
  }
}
