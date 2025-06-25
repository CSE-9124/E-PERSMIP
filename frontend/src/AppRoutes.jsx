import { Routes, Route, Navigate } from 'react-router-dom'
import HomeAdmin from './pages/admin/HomeAdmin'
import HomeUser from './pages/user/HomeUser'
import BookManagement from './pages/admin/BookManagement'
import UserManagement from './pages/admin/UserManagement'
import Statistics from './pages/admin/Statistics'
import AuthWrapper from './components/AuthWrapper'
import BorrowBook from './pages/user/BorrowBook'
import BorrowHistory from './pages/user/BorrowHistory'
import BookDetail from './pages/user/BookDetail'
import BorrowManagement from './pages/admin/BorrowManagement'

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
      <Route path="/admin/borrows" element={
        <RequireAuth allowedRole="admin">
          <BorrowManagement />
        </RequireAuth>
      } />
      {/* User routes */}
      <Route path="/user/home" element={
        <RequireAuth allowedRole="user">
          <HomeUser onLogout={handleLogout} />
        </RequireAuth>
      } />      <Route path="/user/borrow" element={
        <RequireAuth allowedRole="user">
          <BorrowBook onLogout={handleLogout} />
        </RequireAuth>
      } />
      <Route path="/user/book/:bookId" element={
        <RequireAuth allowedRole="user">
          <BookDetail onLogout={handleLogout} />
        </RequireAuth>
      } />
      <Route path="/user/history" element={
        <RequireAuth allowedRole="user">
          <BorrowHistory onLogout={handleLogout} />
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
