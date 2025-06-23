import { useState } from 'react'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import { useNavigate } from 'react-router-dom'

const AuthWrapper = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [role, setRole] = useState('admin') // default admin
  const navigate = useNavigate()

  const handleSwitchToRegister = () => {
    console.log('Switching to register...') // Debug log
    setIsLogin(false)
    setError(null) // Clear error when switching
  }

  const handleSwitchToLogin = () => {
    console.log('Switching to login...') // Debug log
    setIsLogin(true)
    setError(null) // Clear error when switching
  }

  // Login: pilih role admin/user
  const handleLogin = async (formData) => {
    localStorage.setItem('access_token', 'dummy')
    localStorage.setItem('user_role', role)
    if (onLogin) onLogin(role)
    if (role === 'admin') {
      navigate('/admin/books')
    } else {
      navigate('/user/home')
      setSuccess('Login mahasiswa berhasil!')
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  // Real register dengan backend API
  const handleRegister = async (formData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await authAPI.register(formData.name, formData.email, formData.password);
      console.log('Registration successful');
      alert('Registrasi berhasil! Silakan login.');
      setIsLogin(true); // Switch to login after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message);
      alert(`Registrasi gagal: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          {error}
        </div>
      )}
      
      {success && (
        <div className="fixed top-4 left-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          {success}
        </div>
      )}
      
      {isLogin ? (
        <Login 
          onSwitchToRegister={handleSwitchToRegister}
          onLogin={handleLogin}
          isLoading={isLoading}
          role={role}
          setRole={setRole}
        />
      ) : (
        <Register 
          onSwitchToLogin={handleSwitchToLogin}
          onRegister={handleRegister}
          isLoading={isLoading}
        />
      )}
    </>
  )
}

export default AuthWrapper
