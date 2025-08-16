import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice.js'
import { setTheme, toggleNotifications } from '../../store/slices/uiSlice.js'
import { Bell, Settings, LogOut, Sun, Moon, User, Menu } from 'lucide-react'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { theme, sidebarOpen, notifications } = useSelector((state) => state.ui)
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

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))
  }

  const handleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const handleSettings = () => {
    setShowSettings(!showSettings)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Logo and Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => dispatch({ type: 'ui/toggleSidebar' })}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Budget AI</h1>
          </div>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={handleNotifications}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell className="w-5 h-5" />
              {notifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notifications</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">Your Food budget is 13% used this month</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">Transaction added successfully</p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">No more notifications</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative">
            <button 
              onClick={handleSettings}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            {showSettings && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Notifications</span>
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
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
                      <button
                        onClick={toggleTheme}
                        className={`w-11 h-6 rounded-full transition-colors ${
                          theme === 'dark' ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
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
