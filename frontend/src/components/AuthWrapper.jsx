import { useState } from 'react'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

const AuthWrapper = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)

  const handleSwitchToRegister = () => {
    console.log('Switching to register...') // Debug log
    setIsLogin(false)
  }

  const handleSwitchToLogin = () => {
    console.log('Switching to login...') // Debug log
    setIsLogin(true)
  }

  // Simulasi login: jika email mengandung 'admin', role=admin, selain itu user
  const handleLogin = async (formData) => {
    // ...bisa tambahkan request ke backend di sini...
    let role = formData.email.toLowerCase().includes('admin') ? 'admin' : 'user';
    alert(`Login berhasil sebagai ${role}! (Demo)`);
    if (onLogin) onLogin(role);
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
