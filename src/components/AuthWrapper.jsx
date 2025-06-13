import { useState } from 'react'
import Login from './Login'
import Register from './Register'

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true)

  const handleSwitchToRegister = () => {
    setIsLogin(false)
  }

  const handleSwitchToLogin = () => {
    setIsLogin(true)
  }

  const handleLogin = (formData) => {
    console.log('Login data:', formData)
    // Di sini Anda bisa menambahkan logika untuk mengirim data ke backend
    alert('Login berhasil! (Demo)')
  }

  const handleRegister = (formData) => {
    console.log('Register data:', formData)
    // Di sini Anda bisa menambahkan logika untuk mengirim data ke backend
    alert('Registrasi berhasil! (Demo)')
  }

  return (
    <>
      {isLogin ? (
        <Login 
          onSwitchToRegister={handleSwitchToRegister}
          onLogin={handleLogin}
        />
      ) : (
        <Register 
          onSwitchToLogin={handleSwitchToLogin}
          onRegister={handleRegister}
        />
      )}
    </>
  )
}

export default AuthWrapper
