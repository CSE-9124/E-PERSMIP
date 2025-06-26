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
      }
      setTimeout(() => setSuccess('Login berhasil!'), 100)
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setTimeout(() => setError('Email atau password salah!'), 100)
      } else {
        setTimeout(() => setError('Terjadi kesalahan saat login!'), 100)
      }
      console.error('Login error:', err)
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
    const nim = (formData.nim || '').trim()
    const password = (formData.password || '').trim()
    const role = 'user' // Default role to 'user'
    
    if (!email || !full_name || !nim || !password) {
      setTimeout(() => setError('Semua field harus diisi!'), 100)
      setIsLoading(false)
      return
    }

    // Validasi password minimal 8 karakter
    if (password.length < 8) {
      setTimeout(() => setError("Password harus minimal 8 karakter!"), 100)
      setIsLoading(false)
      return
    }
    
    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setTimeout(() => setError("Email tidak valid!"), 100)
      setIsLoading(false)
      return
    }

    // Validasi email sudah terdaftar di backend
    const existingUser = await authAPI.checkEmailExists(email)
    if (existingUser) {
      setTimeout(() => setError('Email sudah terdaftar!'), 100)
      setIsLoading(false)
      return
    }

    // Validasi nim sudah terdaftar di backend
    const existingNim = await authAPI.checkNimExists(nim)
    if (existingNim) {
      setTimeout(() => setError('NIM sudah terdaftar!'), 100)
      setIsLoading(false)
      return
    }
    
    try {
      await authAPI.register({
        full_name: full_name,
        email: email,
        nim: nim,
        password: password,
        role: role
      })
      setTimeout(() => setSuccess('Registrasi berhasil! Silakan login.'), 100)
      setTimeout(() => setIsLogin(true), 2000)
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setTimeout(() => setError('Email atau NIM sudah terdaftar!'), 100)
      } else {
        setTimeout(() => setError('Terjadi kesalahan saat registrasi!'), 100)
      }
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