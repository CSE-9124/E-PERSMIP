import React from 'react'
import unhasLogo from '../../assets/unhas-logo.png'

function HomeAdmin({ onLogout }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-red-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img src={unhasLogo} alt="Universitas Hasanuddin Logo" className="h-12 w-12 object-contain" />
              <div>
                <h1 className="text-3xl font-bold text-white">E-PERSMIP</h1>
                <p className="text-sm text-white opacity-80">Universitas Hasanuddin</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white font-semibold mr-2 capitalize">Admin</span>
              <button onClick={onLogout} className="btn bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white btn-sm">Logout</button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-700">Welcome Admin</h2>
          <p className="text-lg text-gray-700 opacity-70">Sistem Elektronik Peminjaman Perpustakaan MIPA Universitas Hasanuddin</p>
          <p className="mt-2 text-base text-gray-500">Anda login sebagai <span className="font-semibold text-red-600">admin</span></p>
        </div>
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="card-body">
              <h2 className="card-title text-red-700">📚 Kelola Buku</h2>
              <p className="text-gray-600 opacity-70">Tambah, edit, hapus data buku perpustakaan</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Kelola Buku</button>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="card-body">
              <h2 className="card-title text-red-700">👤 Kelola User</h2>
              <p className="text-gray-600 opacity-70">Kelola akun mahasiswa & admin</p>
              <div className="card-actions justify-end">
                <button className="btn btn-secondary">Kelola User</button>
              </div>
            </div>
          </div>
          <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="card-body">
              <h2 className="card-title text-red-700">📊 Statistik Peminjaman</h2>
              <p className="text-gray-600 opacity-70">Lihat statistik peminjaman & aktivitas</p>
              <div className="card-actions justify-end">
                <button className="btn btn-accent">Lihat Statistik</button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-4 text-red-700">Aktivitas Terbaru (Admin)</h3>
          <ul className="space-y-3">
            <li className="flex items-center p-3 rounded-lg bg-gray-100">
              <span className="w-2 h-2 bg-info rounded-full mr-3"></span>
              <span className="text-gray-700">User baru <b>mahasiswa1</b> didaftarkan</span>
            </li>
            <li className="flex items-center p-3 rounded-lg bg-gray-100">
              <span className="w-2 h-2 bg-success rounded-full mr-3"></span>
              <span className="text-gray-700">Buku <b>"Pemrograman Web"</b> ditambahkan</span>
            </li>
            <li className="flex items-center p-3 rounded-lg bg-gray-100">
              <span className="w-2 h-2 bg-warning rounded-full mr-3"></span>
              <span className="text-gray-700">3 buku akan jatuh tempo besok</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default HomeAdmin
