import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { aiService } from '../../services/aiService.js'

const initialState = {
  insights: [],
  anomalies: [],
  patterns: [],
  recommendations: [],
  forecasts: [],
  isLoading: false,
  error: null,
}

export const fetchFinancialInsights = createAsyncThunk(
  'ai/fetchFinancialInsights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiService.getFinancialInsights()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch financial insights')
    }
  }
)

export const fetchAnomalies = createAsyncThunk(
  'ai/fetchAnomalies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiService.getAnomalies()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch anomalies')
    }
  }
)

export const fetchSpendingPatterns = createAsyncThunk(
  'ai/fetchSpendingPatterns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiService.getSpendingPatterns()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch spending patterns')
    }
  }
)

export const fetchBudgetRecommendations = createAsyncThunk(
  'ai/fetchBudgetRecommendations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiService.getBudgetRecommendations()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch budget recommendations')
    }
  }
)

export const fetchSpendingForecast = createAsyncThunk(
  'ai/fetchSpendingForecast',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiService.getSpendingForecast()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch spending forecast')
    }
  }
)

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Financial Insights
      .addCase(fetchFinancialInsights.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFinancialInsights.fulfilled, (state, action) => {
        state.isLoading = false
        state.insights = action.payload
      })
      .addCase(fetchFinancialInsights.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Anomalies
      .addCase(fetchAnomalies.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAnomalies.fulfilled, (state, action) => {
        state.isLoading = false
        state.anomalies = action.payload
      })
      .addCase(fetchAnomalies.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Spending Patterns
      .addCase(fetchSpendingPatterns.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSpendingPatterns.fulfilled, (state, action) => {
        state.isLoading = false
        state.patterns = action.payload
      })
      .addCase(fetchSpendingPatterns.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Budget Recommendations
      .addCase(fetchBudgetRecommendations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgetRecommendations.fulfilled, (state, action) => {
        state.isLoading = false
        state.recommendations = action.payload
      })
      .addCase(fetchBudgetRecommendations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Spending Forecast
      .addCase(fetchSpendingForecast.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSpendingForecast.fulfilled, (state, action) => {
        state.isLoading = false
        state.forecasts = action.payload
      })
      .addCase(fetchSpendingForecast.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = aiSlice.actions
export default aiSlice.reducer
