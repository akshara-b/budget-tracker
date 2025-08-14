import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { transactionService } from '../../services/transactionService.js'

const initialState = {
  transactions: [],
  summary: null,
  isLoading: false,
  error: null,
  filters: {
    category: '',
    transaction_type: '',
    date_from: '',
    date_to: '',
  },
}

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionService.getTransactions()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch transactions')
    }
  }
)

export const createTransaction = createAsyncThunk(
  'transactions/createTransaction',
  async (transactionData, { rejectWithValue }) => {
    try {
      const response = await transactionService.createTransaction(transactionData)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create transaction')
    }
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await transactionService.updateTransaction(id, data)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update transaction')
    }
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await transactionService.deleteTransaction(id)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete transaction')
    }
  }
)

export const fetchTransactionSummary = createAsyncThunk(
  'transactions/fetchTransactionSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await transactionService.getTransactionSummary()
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch transaction summary')
    }
  }
)

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        transaction_type: '',
        date_from: '',
        date_to: '',
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions.unshift(action.payload)
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update Transaction
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.transactions.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.transactions[index] = action.payload
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Delete Transaction
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isLoading = false
        state.transactions = state.transactions.filter(t => t.id !== action.payload)
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Fetch Transaction Summary
      .addCase(fetchTransactionSummary.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchTransactionSummary.fulfilled, (state, action) => {
        state.isLoading = false
        state.summary = action.payload
      })
      .addCase(fetchTransactionSummary.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { setFilters, clearFilters, clearError } = transactionSlice.actions
export default transactionSlice.reducer
