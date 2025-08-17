import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice.js'
import { toggleNotifications } from '../../store/slices/uiSlice.js'
import { Bell, Settings, LogOut, User, Menu } from 'lucide-react'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { sidebarOpen, notifications } = useSelector((state) => state.ui)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const handleSettings = () => {
    setShowSettings(!showSettings)
  }

  return (
    <header className="bg-white/70 backdrop-blur-md shadow-lg border-b border-white/20 relative z-40">
      {/* Gradient overlay that matches the main background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80"></div>
      
      <div className="relative flex items-center justify-between px-6 py-4">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch({ type: 'ui/toggleSidebar' })}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg lg:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Budget AI
              </h1>
              <p className="text-xs text-gray-500">Smart Finance Manager</p>
            </div>
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={handleNotifications}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notifications && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="dropdown-menu right-0 mt-2 w-80 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">Your Food budget is 13% used this month</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">Transaction added successfully</p>
                    </div>
                    <p className="text-sm text-gray-500 text-center">No more notifications</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative">
            <button 
              onClick={handleSettings}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            {showSettings && (
              <div className="dropdown-menu right-0 mt-2 w-64 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/30">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Notifications</span>
                      <button
                        onClick={() => dispatch(toggleNotifications())}
                        className={`w-11 h-6 rounded-full transition-colors ${
                          notifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            notifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {user?.full_name || 'User'}
              </span>
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
