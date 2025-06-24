import { useState } from 'react'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'

const AuthWrapper = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [role, setRole] = useState('user') // default user
  const navigate = useNavigate()

  const handleSwitchToRegister = () => {
    setIsLogin(false)
    setError(null)
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
    setError(null)
  }
  // Login menggunakan API service
  const handleLogin = async (formData) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user, role: userRole, token } = await authAPI.login(formData.email, formData.password)
      
      if (onLogin) onLogin(userRole)
      
      if (userRole === 'admin') {
        navigate('/admin')
      } else {
        navigate('/user/home')
        setSuccess('Login berhasil!')
        setTimeout(() => setSuccess(null), 3000)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  // Register menggunakan API service
  const handleRegister = async (formData) => {
    setIsLoading(true)
    setError(null)
    
    // Validasi sederhana: pastikan semua field terisi dan string
    const email = (formData.email || '').trim()
    const full_name = (formData.name || '').trim()
    const password = (formData.password || '').trim()
    
    if (!email || !full_name || !password) {
      setError('Semua field wajib diisi!')
      setIsLoading(false)
      return
    }
    
    // Validasi password minimal 8 karakter
    if (password.length < 8) {
      setError('Password harus minimal 8 karakter!')
      setIsLoading(false)
      return
    }
    
    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Format email tidak valid!')
      setIsLoading(false)
      return
    }
    
    try {
      await authAPI.register(full_name, email, password)
      setSuccess('Registrasi berhasil! Silakan login.')
      setIsLogin(true)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50 animate-fade-in">
          {error}
        </div>
      )}
      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 animate-fade-in">
          {success}
        </div>
      )}      {isLogin ? (
        <Login onSwitchToRegister={handleSwitchToRegister} onLogin={handleLogin} isLoading={isLoading} />
      ) : (
        <Register onSwitchToLogin={handleSwitchToLogin} onRegister={handleRegister} isLoading={isLoading} />
      )}
    </>
  )
}

export default AuthWrapper
