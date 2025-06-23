import React from 'react'
import unhasLogo from '../../assets/unhas-logo.png'

function HomeUser({ onLogout }) {
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
              <span className="text-white font-semibold mr-2 capitalize">User</span>
              <button onClick={onLogout} className="btn bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white btn-sm">Logout</button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-700">Welcome to E-PERSMIP Dashboard</h2>
          <p className="text-lg text-gray-700 opacity-70">Sistem Elektronik Peminjaman Perpustakaan MIPA Universitas Hasanuddin</p>
          <p className="mt-2 text-base text-gray-500">Anda login sebagai <span className="font-semibold text-red-600">user</span></p>
        </div>
        <div className="stats stats-vertical lg:stats-horizontal shadow mb-8 w-full">
          <div className="stat">
            <div className="stat-figure text-primary"></div>
            <div className="stat-title">Total Buku</div>
            <div className="stat-value text-primary">1,247</div>
            <div className="stat-desc">Koleksi lengkap</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary"></div>
            <div className="stat-title">Dipinjam</div>
            <div className="stat-value text-secondary">189</div>
            <div className="stat-desc">Sedang dipinjam</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-success"></div>
            <div className="stat-title">Tersedia</div>
            <div className="stat-value text-success">1,058</div>
            <div className="stat-desc">Siap dipinjam</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-warning"></div>
            <div className="stat-title">Terlambat</div>
            <div className="stat-value text-warning">12</div>
            <div className="stat-desc">Perlu dikembalikan</div>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-red-700">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-red-700">📚 Pinjam Buku</h2>
                <p className="text-gray-600 opacity-70">Pinjam buku dari koleksi perpustakaan</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Pinjam</button>
                </div>
              </div>
            </div>
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-red-700">🔍 Cari Buku</h2>
                <p className="text-gray-600 opacity-70">Cari dan browse katalog buku tersedia</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-secondary">Cari</button>
                </div>
              </div>
            </div>
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-red-700">📋 Riwayat Peminjaman</h2>
                <p className="text-gray-600 opacity-70">Lihat riwayat dan status peminjaman</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-accent">Lihat</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-red-700">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-gray-100">
              <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-700">Buku "Algoritma dan Struktur Data" dikembalikan</p>
                <p className="text-sm text-gray-500 opacity-60">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-gray-100">
              <div className="w-2 h-2 bg-info rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-700">Buku baru "Machine Learning" ditambahkan</p>
                <p className="text-sm text-gray-500 opacity-60">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-gray-100">
              <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-700">Pengingat: 3 buku akan jatuh tempo besok</p>
                <p className="text-sm text-gray-500 opacity-60">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomeUser
