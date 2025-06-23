import { useState } from 'react'
import AuthWrapper from './components/AuthWrapper'
import HomeAdmin from './pages/admin/HomeAdmin'
import HomeUser from './pages/user/HomeUser'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [role, setRole] = useState(null)

  const handleLoginSuccess = (userRole) => {
    setIsAuthenticated(true)
    setRole(userRole)
  }

  // Jika belum login, tampilkan AuthWrapper (login/register)
  if (!isAuthenticated) {
    return (
      <AuthWrapper 
        onLogin={handleLoginSuccess}
      />
    )
  }

  // Pisahkan komponen HomeAdmin dan HomeUser
  if (role === 'admin') {
    return <HomeAdmin onLogout={() => { setIsAuthenticated(false); setRole(null); }} />
  }
  return <HomeUser onLogout={() => { setIsAuthenticated(false); setRole(null); }} />
}

export default App
