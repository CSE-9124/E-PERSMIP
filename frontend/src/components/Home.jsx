// Example of DaisyUI components you can use in this file:
// - btn (button)
// - card 
// - stats
// - navbar
// - drawer
// - modal
// - hero
// - badge
// - loading
// Documentation: https://daisyui.com/

import React, { useEffect } from 'react'

function Home({ toggleTheme, isDarkMode, onLogout }) {
  // Set data-theme attribute on mount and when isDarkMode changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">
      {/* Header */}
      <header className="bg-base-100 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-base-content">E-PERSMIP</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-circle"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={onLogout}
                className="btn btn-error btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-base-100 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-base-content">Welcome to E-PERSMIP Dashboard</h2>
          <p className="text-lg text-base-content opacity-70">
            Sistem Elektronik Peminjaman Perpustakaan MIPA Universitas Hasanuddin
          </p>
        </div>

        {/* Statistics Cards - Using DaisyUI Stats */}
        <div className="stats stats-vertical lg:stats-horizontal shadow mb-8 w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <div className="stat-title">Total Buku</div>
            <div className="stat-value text-primary">1,247</div>
            <div className="stat-desc">Koleksi lengkap</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="stat-title">Dipinjam</div>
            <div className="stat-value text-secondary">189</div>
            <div className="stat-desc">Sedang dipinjam</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Tersedia</div>
            <div className="stat-value text-success">1,058</div>
            <div className="stat-desc">Siap dipinjam</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div className="stat-title">Terlambat</div>
            <div className="stat-value text-warning">12</div>
            <div className="stat-desc">Perlu dikembalikan</div>
          </div>
        </div>        {/* Quick Actions - Using DaisyUI Cards */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-base-content">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-base-content">📚 Pinjam Buku</h2>
                <p className="text-base-content opacity-70">Pinjam buku dari koleksi perpustakaan</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">Pinjam</button>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-base-content">🔍 Cari Buku</h2>
                <p className="text-base-content opacity-70">Cari dan browse katalog buku tersedia</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-secondary">Cari</button>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-base-content">📋 Riwayat Peminjaman</h2>
                <p className="text-base-content opacity-70">Lihat riwayat dan status peminjaman</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-accent">Lihat</button>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Recent Activity */}
        <div className="bg-base-100 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-base-content">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-base-200">
              <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-base-content">Buku "Algoritma dan Struktur Data" dikembalikan</p>
                <p className="text-sm text-base-content opacity-60">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-base-200">
              <div className="w-2 h-2 bg-info rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-base-content">Buku baru "Machine Learning" ditambahkan</p>
                <p className="text-sm text-base-content opacity-60">
                  5 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-base-200">
              <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-base-content">Pengingat: 3 buku akan jatuh tempo besok</p>
                <p className="text-sm text-base-content opacity-60">
                  1 day ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
