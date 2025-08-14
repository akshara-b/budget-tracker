import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { budgetService } from '../../services/budgetService.js'

const initialState = {
  budgets: [],
  progress: [],
  isLoading: false,
  error: null,
}

export const fetchBudgets = createAsyncThunk(
  'budgets/fetchBudgets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await budgetService.getBudgets()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch budgets')
    }
  }
)

export const createBudget = createAsyncThunk(
  'budgets/createBudget',
  async (budgetData, { rejectWithValue }) => {
    try {
      const response = await budgetService.createBudget(budgetData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create budget')
    }
  }
)

export const updateBudget = createAsyncThunk(
  'budgets/updateBudget',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await budgetService.updateBudget(id, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update budget')
    }
  }
)

export const deleteBudget = createAsyncThunk(
  'budgets/deleteBudget',
  async (id, { rejectWithValue }) => {
    try {
      await budgetService.deleteBudget(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete budget')
    }
  }
)

export const fetchBudgetProgress = createAsyncThunk(
  'budgets/fetchBudgetProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await budgetService.getBudgetProgress()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch budget progress')
    }
  }
)

const budgetSlice = createSlice({
  name: 'budgets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Budgets
      .addCase(fetchBudgets.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = action.payload
      })
      .addCase(fetchBudgets.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create Budget
      .addCase(createBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBudget.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets.push(action.payload)
      })
      .addCase(createBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update Budget
      .addCase(updateBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.budgets.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.budgets[index] = action.payload
        }
      })
      .addCase(updateBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Delete Budget
      .addCase(deleteBudget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.isLoading = false
        state.budgets = state.budgets.filter(b => b.id !== action.payload)
      })
      .addCase(deleteBudget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Budget Progress
      .addCase(fetchBudgetProgress.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchBudgetProgress.fulfilled, (state, action) => {
        state.isLoading = false
        state.progress = action.payload
      })
      .addCase(fetchBudgetProgress.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = budgetSlice.actions
export default budgetSlice.reducer
