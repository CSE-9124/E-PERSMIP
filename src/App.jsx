import { useState } from 'react'
import AuthToggle from './components/AuthToggle'
import Home from './components/Home'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  if (!isAuthenticated) {
    return <AuthToggle onLogin={() => setIsAuthenticated(true)} />
  }

  return <Home 
    toggleTheme={toggleTheme} 
    isDarkMode={isDarkMode} 
    onLogout={() => setIsAuthenticated(false)} 
  />
}

export default App
