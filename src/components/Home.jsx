import React from 'react'

function Home({ toggleTheme, isDarkMode, onLogout }) {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <header className={`shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold">E-PERSMIP</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>              <button 
                onClick={onLogout}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className={`rounded-lg p-6 mb-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className="text-2xl font-bold mb-4">Welcome to E-PERSMIP Dashboard</h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Sistem Elektronik Perencanaan, Evaluasi, dan Pelaporan Satuan Militer Indonesia Polri
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`rounded-lg p-6 ${
            isDarkMode ? 'bg-blue-800' : 'bg-blue-500'
          } text-white shadow-lg`}>
            <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
            <p className="text-3xl font-bold">24</p>
          </div>
          <div className={`rounded-lg p-6 ${
            isDarkMode ? 'bg-green-800' : 'bg-green-500'
          } text-white shadow-lg`}>
            <h3 className="text-lg font-semibold mb-2">Completed</h3>
            <p className="text-3xl font-bold">18</p>
          </div>
          <div className={`rounded-lg p-6 ${
            isDarkMode ? 'bg-yellow-800' : 'bg-yellow-500'
          } text-white shadow-lg`}>
            <h3 className="text-lg font-semibold mb-2">In Progress</h3>
            <p className="text-3xl font-bold">4</p>
          </div>
          <div className={`rounded-lg p-6 ${
            isDarkMode ? 'bg-red-800' : 'bg-red-500'
          } text-white shadow-lg`}>
            <h3 className="text-lg font-semibold mb-2">Pending</h3>
            <p className="text-3xl font-bold">2</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`rounded-lg p-6 mb-8 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className={`p-4 rounded-lg text-left transition-colors duration-200 ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}>
              <h4 className="font-semibold mb-2">📝 Create New Report</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Generate a new planning or evaluation report
              </p>
            </button>
            <button className={`p-4 rounded-lg text-left transition-colors duration-200 ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}>
              <h4 className="font-semibold mb-2">📊 View Analytics</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Access detailed performance analytics
              </p>
            </button>
            <button className={`p-4 rounded-lg text-left transition-colors duration-200 ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}>
              <h4 className="font-semibold mb-2">📁 Manage Documents</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Organize and manage your documents
              </p>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`rounded-lg p-6 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className={`flex items-center p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">Report "Q4 Planning" submitted</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  2 hours ago
                </p>
              </div>
            </div>
            <div className={`flex items-center p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">New document uploaded</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  5 hours ago
                </p>
              </div>
            </div>
            <div className={`flex items-center p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium">Evaluation review pending</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  1 day ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
