import React from 'react'
import NavbarAdmin from '../../components/NavbarAdmin'
import { useNavigate } from 'react-router-dom'
import { BookOpenIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/solid'
import unhasLogo from '../../assets/unhas-logo.png'

function HomeAdmin({ onLogout }) {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <NavbarAdmin onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/80 rounded-2xl p-8 mb-10 shadow-2xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold mb-2 text-red-700">Selamat Datang, Admin!</h2>
            <p className="text-lg text-gray-700 opacity-80">Sistem Elektronik Peminjaman Perpustakaan MIPA Universitas Hasanuddin</p>
            <p className="mt-2 text-base text-gray-500">Anda login sebagai <span className="font-semibold text-red-600">admin</span></p>
          </div>
          <img src={unhasLogo} alt="Logo Unhas" className="h-24 w-24 object-contain opacity-80 hidden md:block" />
        </div>
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-red-100 to-pink-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-red-400">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-2">
                <BookOpenIcon className="h-7 w-7 text-red-600" />
                <h2 className="card-title text-red-700 text-2xl font-bold">Kelola Buku</h2>
              </div>
              <p className="text-gray-600 opacity-80 mb-4">Tambah, edit, hapus data buku perpustakaan</p>
              <div className="card-actions justify-end">
                <button className="btn bg-red-600 text-white hover:bg-red-700 font-semibold px-6 py-2 rounded-xl shadow" onClick={() => navigate('/admin/books')}>Kelola Buku</button>
              </div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-pink-100 to-red-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-pink-400">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-2">
                <UsersIcon className="h-7 w-7 text-pink-600" />
                <h2 className="card-title text-pink-700 text-2xl font-bold">Kelola User</h2>
              </div>
              <p className="text-gray-600 opacity-80 mb-4">Kelola akun mahasiswa & admin</p>
              <div className="card-actions justify-end">
                <button className="btn bg-pink-500 text-white hover:bg-pink-600 font-semibold px-6 py-2 rounded-xl shadow" onClick={() => navigate('/admin/users')}>Kelola User</button>
              </div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-yellow-100 to-pink-50 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-yellow-400">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-2">
                <ChartBarIcon className="h-7 w-7 text-yellow-500" />
                <h2 className="card-title text-yellow-700 text-2xl font-bold">Statistik Peminjaman</h2>
              </div>
              <p className="text-gray-600 opacity-80 mb-4">Lihat statistik peminjaman & aktivitas</p>
              <div className="card-actions justify-end">
                <button className="btn bg-yellow-400 text-white hover:bg-yellow-500 font-semibold px-6 py-2 rounded-xl shadow" onClick={() => navigate('/admin/statistics')}>Lihat Statistik</button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/90 rounded-2xl p-8 shadow-xl border border-red-100 mb-8">
          <h3 className="text-xl font-bold mb-6 text-red-700 flex items-center gap-2"><span className="text-2xl">🕒</span> Aktivitas Terbaru (Admin)</h3>
          <ul className="space-y-4">
            <li className="flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 shadow-sm">
              <span className="w-3 h-3 bg-blue-400 rounded-full mr-4"></span>
              <span className="text-gray-700">User baru <b>mahasiswa1</b> didaftarkan</span>
            </li>
            <li className="flex items-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 shadow-sm">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-4"></span>
              <span className="text-gray-700">Buku <b>"Pemrograman Web"</b> ditambahkan</span>
            </li>
            <li className="flex items-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 shadow-sm">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-4"></span>
              <span className="text-gray-700">3 buku akan jatuh tempo besok</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default HomeAdmin
