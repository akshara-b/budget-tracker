import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { reportService } from '../../services/reportService.js'

const initialState = {
  financialSummary: null,
  spendingByCategory: [],
  monthlyTrends: [],
  isLoading: false,
  error: null,
}

export const fetchFinancialSummary = createAsyncThunk(
  'reports/fetchFinancialSummary',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reportService.getFinancialSummary(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch financial summary')
    }
  }
)

export const fetchSpendingByCategory = createAsyncThunk(
  'reports/fetchSpendingByCategory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reportService.getSpendingByCategory(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch spending by category')
    }
  }
)

export const fetchMonthlyTrends = createAsyncThunk(
  'reports/fetchMonthlyTrends',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reportService.getMonthlyTrends(params)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch monthly trends')
    }
  }
)

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearReports: (state) => {
      state.financialSummary = null
      state.spendingByCategory = []
      state.monthlyTrends = []
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Financial Summary
      .addCase(fetchFinancialSummary.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFinancialSummary.fulfilled, (state, action) => {
        state.isLoading = false
        state.financialSummary = action.payload
        state.error = null
      })
      .addCase(fetchFinancialSummary.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Spending by Category
      .addCase(fetchSpendingByCategory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSpendingByCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.spendingByCategory = action.payload
        state.error = null
      })
      .addCase(fetchSpendingByCategory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Monthly Trends
      .addCase(fetchMonthlyTrends.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMonthlyTrends.fulfilled, (state, action) => {
        state.isLoading = false
        state.monthlyTrends = action.payload
        state.error = null
      })
      .addCase(fetchMonthlyTrends.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearReports } = reportSlice.actions

export default reportSlice.reducer
