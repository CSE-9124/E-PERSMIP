import { useState } from 'react'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../services/api'
import { showNotification } from '../utils/notification'

const AuthWrapper = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSwitchToRegister = () => {
    setIsLogin(false)
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
  }
  const handleLogin = async (formData) => {
    setIsLoading(true)
    try {
      const { user, role: userRole, token } = await authAPI.login(formData.email, formData.password)
      
      if (onLogin) onLogin(userRole)
      
      if (userRole === 'admin') {
        navigate('/admin')
      } else {
        navigate('/user/home')
      }
      showNotification('Login berhasil!')
    } catch (err) {
      if (err.response && err.response.status === 401) {
        showNotification('Email atau password salah!', 'error')
      } else {
        showNotification('Terjadi kesalahan saat login!', 'error')
      }
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }
  const handleRegister = async (formData) => {
    setIsLoading(true)
    
    const email = (formData.email || '').trim()
    const full_name = (formData.name || '').trim()
    const nim = (formData.nim || '').trim()
    const password = (formData.password || '').trim()
    const role = 'user'
    
    if (!email || !full_name || !nim || !password) {
      showNotification('Semua field harus diisi!', 'error')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      showNotification("Password harus minimal 8 karakter!", 'error')
      setIsLoading(false)
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      showNotification("Email tidak valid!", 'error')
      setIsLoading(false)
      return
    }

    const existingUser = await authAPI.checkEmailExists(email)
    if (existingUser) {
      showNotification('Email sudah terdaftar!', 'error')
      setIsLoading(false)
      return
    }

    const existingNim = await authAPI.checkNimExists(nim)
    if (existingNim) {
      showNotification('NIM sudah terdaftar!', 'error')
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
      showNotification('Registrasi berhasil! Silakan login.')
      setTimeout(() => setIsLogin(true), 2000)
    } catch (err) {
      if (err.response && err.response.status === 400) {
        showNotification('Email atau NIM sudah terdaftar!', 'error')
      } else {
        showNotification('Terjadi kesalahan saat registrasi!', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLogin ? (
        <Login onSwitchToRegister={handleSwitchToRegister} onLogin={handleLogin} isLoading={isLoading} />
      ) : (
        <Register onSwitchToLogin={handleSwitchToLogin} onRegister={handleRegister} isLoading={isLoading} />
      )}
    </>
  )
}

export default AuthWrapper