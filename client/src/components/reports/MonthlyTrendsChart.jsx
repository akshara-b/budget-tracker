import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { formatCurrency, formatCurrencyCompact } from '../../utils/currency.js'

const MonthlyTrendsChart = ({ data = [], chartType = 'bar' }) => {
  // Transform the data or provide fallback
  const chartData = data.length > 0 ? data.map(item => ({
    month: item.month,
    income: item.income,
    expenses: item.expense || item.expenses,
    savings: item.income - (item.expense || item.expenses || 0)
  })) : [
    { month: 'No Data', income: 0, expenses: 0, savings: 0 }
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} tickFormatter={formatCurrencyCompact} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income" fill="#10B981" name="Income" />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
          <Bar dataKey="savings" fill="#3B82F6" name="Savings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyTrendsChart
