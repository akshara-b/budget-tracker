import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Background overlay for depth - fixed to prevent movement */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/5 via-indigo-900/5 to-purple-900/5 pointer-events-none"></div>
      
      {/* Animated background shapes - made more stable */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-indigo-600/15 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/8 to-purple-600/8 rounded-full blur-3xl opacity-60"></div>
      </div>
      
      <div className="relative z-30 min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 layout-stable">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout
