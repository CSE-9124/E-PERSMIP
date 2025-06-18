import { useState } from 'react'
import AuthToggle from './components/AuthToggle'
import Home from './components/Home'
import GuestHome from './components/GuestHome'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleLogin = () => {
    setShowLogin(true)
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setShowLogin(false)
  }

  const handleBackToGuest = () => {
    setShowLogin(false)
  }

  // Show login form
  if (showLogin) {
    return (
      <AuthToggle 
        onLogin={handleLoginSuccess} 
        onBack={handleBackToGuest}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    )
  }

  // Show authenticated home
  if (isAuthenticated) {
    return (
      <Home 
        toggleTheme={toggleTheme} 
        isDarkMode={isDarkMode} 
        onLogout={() => {
          setIsAuthenticated(false)
          setShowLogin(false)
        }} 
      />
    )
  }

  // Show guest home (default)
  return (
    <GuestHome 
      toggleTheme={toggleTheme} 
      isDarkMode={isDarkMode} 
      onLogin={handleLogin}
    />
  )
}

export default App
