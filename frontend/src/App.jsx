import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import './App.css'

function App() {
  // Inisialisasi dari localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'))
  const [role, setRole] = useState(localStorage.getItem('user_role') || '')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate();

  // Sync state dengan localStorage saat mount dan saat login/logout
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token')
      const savedRole = localStorage.getItem('user_role')
      setIsAuthenticated(!!token)
      setRole(savedRole || '')
      setIsLoading(false)
    }
    checkAuth()
    // Event listener untuk perubahan localStorage (misal: di tab lain)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [])

  // Dipanggil setelah login sukses
  const handleLoginSuccess = (userRole) => {
    setIsAuthenticated(true)
    setRole(userRole)
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_role')
    setIsAuthenticated(false)
    setRole('')
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <AppRoutes
      isAuthenticated={isAuthenticated}
      role={role}
      setIsAuthenticated={setIsAuthenticated}
      setRole={setRole}
      handleLoginSuccess={handleLoginSuccess}
      handleLogout={handleLogout}
    />
  )
}

export default App
