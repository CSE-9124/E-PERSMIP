import React, { useState, useEffect } from 'react'
import NavbarAdmin from '../../components/NavbarAdmin'
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { usersAPI, authAPI } from '../../services/api'

function UserManagement({ onLogout }) {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ id: null, full_name: '', email: '', password: '', role: 'user', is_active: true })
  const [editMode, setEditMode] = useState(false)
  const [notification, setNotification] = useState(null)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('semua')
  const [statusFilter, setStatusFilter] = useState('semua')

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter dan search effect
  useEffect(() => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by role
    if (roleFilter !== 'semua') {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Filter by status
    if (statusFilter !== 'semua') {
      const isActive = statusFilter === 'aktif'
      filtered = filtered.filter((user) => user.is_active === isActive)
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await usersAPI.getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      showNotification('Gagal memuat data user: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleOpenForm = (user = null) => {
    if (user) {
      setForm({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      })
      setEditMode(true)
    } else {
      setForm({ id: null, full_name: '', email: '', role: 'user', is_active: true })
      setEditMode(false)
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setForm({ id: null, full_name: '', email: '', password: '', role: 'user', is_active: true })
    setEditMode(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) {
        // Update user
        const updateData = {
          full_name: form.full_name,
          role: form.role,
          is_active: form.is_active
        }
        await usersAPI.updateUser(form.id, updateData)
        showNotification('User berhasil diupdate!')
      } else {
        // Create new user - pass the form object directly
        await authAPI.register({
          full_name: form.full_name,
          email: form.email,
          password: form.password,
          role: form.role
        })
        showNotification('User baru berhasil ditambahkan!')
      }
      handleCloseForm()
      fetchUsers()
    } catch (error) {
      console.error('Error saving user:', error)
      showNotification('Gagal menyimpan user: ' + error.message, 'error')
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        await usersAPI.deleteUser(userId)
        showNotification('User berhasil dihapus!')
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
        showNotification('Gagal menghapus user: ' + error.message, 'error')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg font-medium ${
          notification.type === 'error' 
            ? 'bg-red-100 border border-red-400 text-red-700' 
            : 'bg-green-100 border border-green-400 text-green-700'
        }`}>
          {notification.message}
        </div>
      )}
      
      <NavbarAdmin onLogout={onLogout} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-800 mb-2">Kelola User</h1>
          <p className="text-gray-600">Kelola dan pantau semua pengguna perpustakaan</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>
            
            {/* Role Filter */}
            <div className="md:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
              >
                <option value="semua">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
              >
                <option value="semua">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-Aktif</option>
              </select>
            </div>

            {/* Add User Button */}
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
              onClick={() => handleOpenForm()}
            >
              <PlusIcon className="h-5 w-5" />
              Tambah User
            </button>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredUsers.length} dari {users.length} pengguna
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Memuat data pengguna...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleOpenForm(user)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-1"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id)} 
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-1"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">👥</div>
                <p className="text-gray-500">Tidak ada data pengguna yang ditemukan</p>
              </div>
            )}
          </div>
        )}

        {/* Modal/Form Tambah/Edit User */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 transition-all">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-red-100 w-full max-w-md p-0 animate-fadeIn">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors text-2xl p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-200 bg-transparent hover:bg-red-50 focus:bg-red-50 active:bg-red-50"
                onClick={handleCloseForm}
                aria-label="Tutup"
              >
                ×
              </button>
              <div className="px-8 pt-8 pb-6">
                <h2 className="text-2xl font-extrabold mb-6 text-red-700 text-center tracking-tight">
                  {editMode ? 'Edit User' : 'Tambah User'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Nama</label>
                    <input 
                      type="text" 
                      name="full_name" 
                      value={form.full_name} 
                      onChange={handleChange} 
                      required
                      className="w-full border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300" 
                    />
                  </div>
                  {!editMode && (
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} 
                        required
                        className="w-full border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300" 
                      />
                    </div>
                  )}
                  {!editMode && (
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Password</label>
                      <input 
                        type="password" 
                        name="password" 
                        value={form.password} 
                        onChange={handleChange} 
                        required
                        placeholder="Minimal 8 karakter"
                        className="w-full border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300" 
                      />
                    </div>
                  )}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Role</label>
                      <select 
                        name="role" 
                        value={form.role} 
                        onChange={handleChange}
                        className="w-full border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white"
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </div>
                    {editMode && (
                      <div className="flex-1">
                        <label className="block text-sm font-semibold mb-1 text-gray-700">Status</label>
                        <div className="flex items-center mt-2">
                          <input 
                            type="checkbox" 
                            name="is_active" 
                            checked={form.is_active} 
                            onChange={handleChange}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <label className="ml-2 text-gray-700">Aktif</label>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button 
                      type="button"
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-semibold transition"
                      onClick={handleCloseForm}
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow-sm border border-red-600 transition"
                    >
                      {editMode ? 'Simpan Perubahan' : 'Tambah User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagement
