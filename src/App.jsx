import { useState } from 'react'
import AuthToggle from './components/AuthToggle'
import './App.css'

import { useState } from 'react'
import AuthToggle from './components/AuthToggle'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  if (!isAuthenticated) {
    return <AuthToggle />
  }

  return (
    <div className={`min-h-screen w-full transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-red-900 to-black' 
        : 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-100'
    }`}>
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          } shadow-lg`}
        >
          {isDarkMode ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex items-center justify-center min-h-screen w-full px-4 py-8">
        <div className="w-full max-w-4xl space-y-8">
          {/* Welcome Header */}
          <div className="text-center">
            <div className={`mx-auto h-24 w-24 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-r from-red-600 to-pink-600'
                : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}>
              <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className={`mt-6 text-5xl font-extrabold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Selamat Datang!
            </h1>
            <p className={`mt-4 text-xl transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Anda berhasil masuk ke E-PERSMIP
            </p>
            <p className={`mt-2 text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Sistem Elektronik Perizinan dan Pelaporan Simpang
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {/* Card 1 - Perizinan */}
            <div className={`backdrop-blur-lg rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700/90' 
                : 'bg-white/95 border-gray-200 hover:bg-white'
            }`}>
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-red-600 to-pink-600'
                    : 'bg-gradient-to-r from-red-500 to-rose-500'
                }`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Perizinan
                </h3>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Kelola permohonan perizinan simpang
                </p>
              </div>
            </div>

            {/* Card 2 - Pelaporan */}
            <div className={`backdrop-blur-lg rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700/90' 
                : 'bg-white/95 border-gray-200 hover:bg-white'
            }`}>
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-red-600 to-pink-600'
                    : 'bg-gradient-to-r from-red-500 to-rose-500'
                }`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Pelaporan
                </h3>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Lihat laporan dan statistik
                </p>
              </div>
            </div>

            {/* Card 3 - Monitoring */}
            <div className={`backdrop-blur-lg rounded-2xl shadow-2xl border transition-all duration-300 hover:scale-105 ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700/90' 
                : 'bg-white/95 border-gray-200 hover:bg-white'
            }`}>
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-red-600 to-pink-600'
                    : 'bg-gradient-to-r from-red-500 to-rose-500'
                }`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Monitoring
                </h3>
                <p className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Monitor status simpang real-time
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setIsAuthenticated(false)}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
              }`}
            >
              <svg className="inline h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
