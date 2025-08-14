import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const MonthlyTrendsChart = () => {
  // Sample data for the chart (in a real app, this would come from the API)
  const data = [
    { month: 'Jan', income: 3000, expenses: 1200, savings: 1800 },
    { month: 'Feb', income: 3200, expenses: 1100, savings: 2100 },
    { month: 'Mar', income: 3100, expenses: 1400, savings: 1700 },
    { month: 'Apr', income: 3300, expenses: 1300, savings: 2000 },
    { month: 'May', income: 3400, expenses: 1600, savings: 1800 },
    { month: 'Jun', income: 3500, expenses: 1500, savings: 2000 },
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

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
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} tickFormatter={formatCurrency} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income" fill="#10B981" name="Income" />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyTrendsChart
