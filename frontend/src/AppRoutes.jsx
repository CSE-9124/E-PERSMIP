import { Routes, Route, Navigate } from 'react-router-dom'
import HomeAdmin from './pages/admin/HomeAdmin'
import HomeUser from './pages/user/HomeUser'
import BookManagement from './pages/admin/BookManagement'
import UserManagement from './pages/admin/UserManagement'
import Statistics from './pages/admin/Statistics'
import AuthWrapper from './components/AuthWrapper'
import BorrowBook from './pages/user/BorrowBook'
import SearchBook from './pages/user/SearchBook'
import BorrowHistory from './pages/user/BorrowHistory'

const AppRoutes = ({ isAuthenticated, role, setIsAuthenticated, setRole, handleLoginSuccess, handleLogout }) => {
  // Route protection wrapper
  const RequireAuth = ({ children, allowedRole }) => {
    if (!isAuthenticated) return <Navigate to="/" replace />
    if (allowedRole && role !== allowedRole) return <Navigate to="/" replace />
    return children
  }

  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin" element={
        <RequireAuth allowedRole="admin">
          <HomeAdmin onLogout={handleLogout} />
        </RequireAuth>
      } />
      <Route path="/admin/books" element={
        <RequireAuth allowedRole="admin">
          <BookManagement />
        </RequireAuth>
      } />
      <Route path="/admin/users" element={
        <RequireAuth allowedRole="admin">
          <UserManagement />
        </RequireAuth>
      } />
      <Route path="/admin/statistics" element={
        <RequireAuth allowedRole="admin">
          <Statistics />
        </RequireAuth>
      } />
      {/* User routes */}
      <Route path="/user/home" element={
        <RequireAuth allowedRole="mahasiswa">
          <HomeUser onLogout={handleLogout} />
        </RequireAuth>
      } />
      <Route path="/user/borrow" element={
        <RequireAuth allowedRole="mahasiswa">
          <BorrowBook />
        </RequireAuth>
      } />
      <Route path="/user/search" element={
        <RequireAuth allowedRole="mahasiswa">
          <SearchBook />
        </RequireAuth>
      } />
      <Route path="/user/history" element={
        <RequireAuth allowedRole="mahasiswa">
          <BorrowHistory />
        </RequireAuth>
      } />
      <Route path="/" element={
        isAuthenticated && role === 'user'
          ? <HomeUser onLogout={handleLogout} />
          : <AuthWrapper onLogin={handleLoginSuccess} />
      } />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
