import React, { useState } from 'react'
import NavbarAdmin from '../../components/NavbarAdmin'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'

const mockUsers = [
  { id: 1, name: 'Rudi Santoso', email: 'rudi@unhas.ac.id', role: 'admin', status: 'aktif' },
  { id: 2, name: 'Siti Aminah', email: 'siti@unhas.ac.id', role: 'mahasiswa', status: 'aktif' },
  { id: 3, name: 'Andi Syamsu', email: 'andi@unhas.ac.id', role: 'mahasiswa', status: 'nonaktif' },
]

function UserManagement() {
  const [users, setUsers] = useState(mockUsers)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ id: null, name: '', email: '', role: 'mahasiswa', status: 'aktif' })
  const [editMode, setEditMode] = useState(false)
  const [filter, setFilter] = useState('')
  const [filterCol, setFilterCol] = useState('all')
  const [showFilterOpt, setShowFilterOpt] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 5

  // Filter logic
  const filteredUsers = users.filter(u => {
    const q = filter.toLowerCase()
    if (!q) return true
    if (filterCol === 'all') {
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.status.toLowerCase().includes(q)
      )
    }
    if (filterCol === 'name') return u.name.toLowerCase().includes(q)
    if (filterCol === 'email') return u.email.toLowerCase().includes(q)
    if (filterCol === 'role') return u.role.toLowerCase().includes(q)
    if (filterCol === 'status') return u.status.toLowerCase().includes(q)
    return true
  })
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize)

  const handleOpenForm = (user = null) => {
    if (user) {
      setForm(user)
      setEditMode(true)
    } else {
      setForm({ id: null, name: '', email: '', role: 'mahasiswa', status: 'aktif' })
      setEditMode(false)
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setForm({ id: null, name: '', email: '', role: 'mahasiswa', status: 'aktif' })
    setEditMode(false)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editMode) {
      setUsers(users.map(u => u.id === form.id ? { ...form } : u))
    } else {
      setUsers([...users, { ...form, id: Date.now() }])
    }
    handleCloseForm()
  }

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus user ini?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <NavbarAdmin />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-extrabold text-red-800 tracking-tight drop-shadow-sm">Kelola User</h1>
          <button
            className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 transition px-4 py-2 rounded-lg font-semibold shadow-sm border border-red-200 text-sm"
            onClick={() => handleOpenForm()}
          >
            <PlusIcon className="h-4 w-4" /> Tambah User
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 relative">
          <div className="flex w-full sm:w-auto gap-2 items-center">
            <input
              type="text"
              placeholder={
                filterCol === 'all' ? 'Cari nama, email, role, status...' :
                filterCol === 'name' ? 'Cari nama...' :
                filterCol === 'email' ? 'Cari email...' :
                filterCol === 'role' ? 'Cari role...' :
                'Cari status...'
              }
              value={filter}
              onChange={e => { setFilter(e.target.value); setPage(1); }}
              className="w-full sm:w-72 border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300 shadow-sm"
            />
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 bg-white text-red-700 font-semibold hover:bg-red-100 transition shadow-sm text-sm"
                onClick={() => setShowFilterOpt(v => !v)}
                aria-label="Filter Kolom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 009 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" /></svg>
                <span className="hidden sm:inline">Filter</span>
              </button>
              {showFilterOpt && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-red-100 rounded-lg shadow-lg z-10" style={{background:'#fff'}}>
                  <ul className="py-1 text-sm text-gray-700">
                    <li>
                      <button className={`w-full text-left px-4 py-2 hover:bg-red-50 focus:bg-red-50 active:bg-red-50 bg-white text-red-700 rounded ${filterCol==='all'?'font-bold text-red-700':''}`} onClick={() => {setFilterCol('all');setShowFilterOpt(false)}}>Semua Kolom</button>
                    </li>
                    <li>
                      <button className={`w-full text-left px-4 py-2 hover:bg-red-50 focus:bg-red-50 active:bg-red-50 bg-white text-gray-700 rounded ${filterCol==='name'?'font-bold text-red-700':''}`} onClick={() => {setFilterCol('name');setShowFilterOpt(false)}}>Nama</button>
                    </li>
                    <li>
                      <button className={`w-full text-left px-4 py-2 hover:bg-red-50 focus:bg-red-50 active:bg-red-50 bg-white text-gray-700 rounded ${filterCol==='email'?'font-bold text-red-700':''}`} onClick={() => {setFilterCol('email');setShowFilterOpt(false)}}>Email</button>
                    </li>
                    <li>
                      <button className={`w-full text-left px-4 py-2 hover:bg-red-50 focus:bg-red-50 active:bg-red-50 bg-white text-gray-700 rounded ${filterCol==='role'?'font-bold text-red-700':''}`} onClick={() => {setFilterCol('role');setShowFilterOpt(false)}}>Role</button>
                    </li>
                    <li>
                      <button className={`w-full text-left px-4 py-2 hover:bg-red-50 focus:bg-red-50 active:bg-red-50 bg-white text-gray-700 rounded ${filterCol==='status'?'font-bold text-red-700':''}`} onClick={() => {setFilterCol('status');setShowFilterOpt(false)}}>Status</button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg shadow border border-red-100 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-red-50 border-b border-red-100">
                <th className="px-6 py-3 text-left font-bold text-red-700 uppercase tracking-wider text-xs">Nama</th>
                <th className="px-6 py-3 text-left font-bold text-red-700 uppercase tracking-wider text-xs">Email</th>
                <th className="px-6 py-3 text-left font-bold text-red-700 uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-3 text-left font-bold text-red-700 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-3 text-center font-bold text-red-700 uppercase tracking-wider text-xs">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">Tidak ada data yang cocok.</td>
                </tr>
              )}
              {paginatedUsers.map((user, idx) => (
                <tr
                  key={user.id}
                  className={`${(idx % 2 === 0 ? 'bg-white' : 'bg-red-50')} border-b border-red-50 hover:bg-red-100/60 transition`}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 capitalize">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 capitalize">{user.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        className="flex items-center gap-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200 rounded-lg px-2 py-1 text-xs font-semibold transition shadow-sm"
                        onClick={() => handleOpenForm(user)}
                      >
                        <PencilSquareIcon className="h-3 w-3" /> Edit
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 rounded-lg px-2 py-1 text-xs font-semibold transition shadow-sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <TrashIcon className="h-3 w-3" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
          <span className="text-gray-500 text-sm">
            Halaman {page} dari {totalPages} | Total: {filteredUsers.length} user
          </span>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded-lg border border-red-200 bg-white text-red-700 font-semibold hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >Sebelumnya</button>
            <button
              className="px-3 py-1 rounded-lg border border-red-200 bg-white text-red-700 font-semibold hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >Berikutnya</button>
          </div>
        </div>
        {/* Modal/Form Tambah/Edit User */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 transition-all">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-red-100 w-full max-w-md p-0 animate-fadeIn">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors text-2xl p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-200 bg-transparent hover:bg-red-50 focus:bg-red-50 active:bg-red-50"
                onClick={handleCloseForm}
                aria-label="Tutup"
              >
                &times;
              </button>
              <div className="px-8 pt-8 pb-6">
                <h2 className="text-2xl font-extrabold mb-6 text-red-700 text-center tracking-tight">
                  {editMode ? 'Edit User' : 'Tambah User'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Nama</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required
                      className="w-full border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                      className="w-full border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Role</label>
                      <select name="role" value={form.role} onChange={handleChange}
                        className="w-full border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white">
                        <option value="admin">Admin</option>
                        <option value="mahasiswa">Mahasiswa</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Status</label>
                      <select name="status" value={form.status} onChange={handleChange}
                        className="w-full border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white">
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Nonaktif</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button type="button"
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-semibold transition"
                      onClick={handleCloseForm}
                    >Batal</button>
                    <button type="submit"
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow-sm border border-red-600 transition"
                    >{editMode ? 'Simpan Perubahan' : 'Tambah User'}</button>
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
