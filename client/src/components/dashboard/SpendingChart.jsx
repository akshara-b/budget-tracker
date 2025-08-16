import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/currency.js'

const SpendingChart = ({ monthlyData = [] }) => {
  // Transform the data to match the chart format
  const formatDataForChart = (data) => {
    if (!data || data.length === 0) {
      // Fallback data if no real data is available
      return [
        { month: 'No Data', income: 0, expenses: 0 }
      ]
    }

    return data.map(item => {
      // Parse the month string (e.g., "2024-01" -> "Jan 2024")
      const [year, monthNum] = item.month.split('-')
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthName = monthNames[parseInt(monthNum) - 1]
      
      return {
        month: `${monthName} ${year}`,
        income: item.income,
        expenses: item.expenses
      }
    })
  }

  const chartData = formatDataForChart(monthlyData)

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={formatCurrency} />
          <Legend />
          <Bar dataKey="income" fill="#10B981" name="Income" />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SpendingChart
