import React, { useState } from 'react'
import NavbarUser from '../../components/NavbarUser'
import { useNavigate } from 'react-router-dom'

function HomeUser({ onLogout }) {
  const [notification, setNotification] = useState(null)
  const navigate = useNavigate()

  // Fungsi untuk notifikasi
  const showNotification = (msg, duration = 3000) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), duration)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Notifikasi */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}
      <NavbarUser onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/90 rounded-2xl p-8 mb-10 shadow-xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold mb-2 text-red-700 flex items-center gap-2">👋 Halo, Mahasiswa!</h2>
            <p className="text-lg text-gray-700 opacity-80">Selamat datang di <span className="font-bold text-red-600">E-PERSMIP</span> — layanan peminjaman buku digital Perpustakaan MIPA Unhas.</p>
            <p className="mt-2 text-base text-gray-500">Ayo cari, pinjam, dan kelola koleksi bukumu dengan mudah!</p>
          </div>
          <div className="hidden md:block text-7xl">📚</div>
        </div>
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-4 text-red-700 flex items-center gap-2">🚀 Akses Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-red-400">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">📚</div>
                <h2 className="card-title text-red-700 text-xl font-bold mb-1">Pinjam Buku</h2>
                <p className="text-gray-600 opacity-80 mb-3">Pilih dan pinjam buku favoritmu</p>
                <button className="btn bg-red-600 text-white hover:bg-red-700 font-semibold px-6 py-2 rounded-xl shadow" onClick={() => navigate('/user/borrow')}>Pinjam</button>
              </div>
            </div>
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-pink-400">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">🔍</div>
                <h2 className="card-title text-pink-700 text-xl font-bold mb-1">Cari Buku</h2>
                <p className="text-gray-600 opacity-80 mb-3">Temukan koleksi buku terbaru</p>
                <button className="btn bg-pink-500 text-white hover:bg-pink-600 font-semibold px-6 py-2 rounded-xl shadow" onClick={() => navigate('/user/search')}>Cari</button>
              </div>
            </div>
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-yellow-400">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">📋</div>
                <h2 className="card-title text-yellow-700 text-xl font-bold mb-1">Riwayat Peminjaman</h2>
                <p className="text-gray-600 opacity-80 mb-3">Lihat status & riwayat peminjamanmu</p>
                <button className="btn bg-yellow-400 text-white hover:bg-yellow-500 font-semibold px-6 py-2 rounded-xl shadow" onClick={() => navigate('/user/history')}>Lihat</button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/90 rounded-2xl p-8 shadow-xl border border-red-100 mb-8">
          <h3 className="text-xl font-bold mb-6 text-red-700 flex items-center gap-2"><span className="text-2xl">🕒</span> Aktivitas Terbaru</h3>
          <ul className="space-y-4">
            <li className="flex items-center p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 shadow-sm">
              <span className="w-3 h-3 bg-blue-400 rounded-full mr-4"></span>
              <span className="text-gray-700">Buku <b>"Algoritma dan Struktur Data"</b> dikembalikan</span>
            </li>
            <li className="flex items-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 shadow-sm">
              <span className="w-3 h-3 bg-green-400 rounded-full mr-4"></span>
              <span className="text-gray-700">Buku baru <b>"Machine Learning"</b> ditambahkan</span>
            </li>
            <li className="flex items-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 shadow-sm">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-4"></span>
              <span className="text-gray-700">Pengingat: 3 buku akan jatuh tempo besok</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default HomeUser
