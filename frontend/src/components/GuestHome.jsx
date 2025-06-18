// Guest mode for E-PERSMIP - Limited access without login
import React, { useEffect } from 'react'
import unhasLogo from '../assets/unhas-logo.png'

function GuestHome({ toggleTheme, isDarkMode, onLogin }) {
  // Set data-theme attribute on mount and when isDarkMode changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleRestrictedAction = (action) => {
    const modal = document.getElementById('login_modal');
    modal.showModal();
  };

  return (
    <div className="min-h-screen bg-base-200 transition-colors duration-300">      {/* Header */}
      <header className="bg-base-100 shadow-lg">        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img 
                src={unhasLogo} 
                alt="Universitas Hasanuddin Logo" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-base-content">E-PERSMIP</h1>
                <p className="text-sm text-base-content opacity-60">Universitas Hasanuddin</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="btn btn-ghost btn-circle"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={onLogin}
                className="btn btn-primary btn-sm">
                Masuk
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">        {/* Welcome Section - Guest Mode */}
        <div className="bg-base-100 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-base-content">Selamat Datang di E-PERSMIP</h2>
          <p className="text-lg text-base-content opacity-70">
            Sistem Elektronik Peminjaman Perpustakaan MIPA Universitas Hasanuddin
          </p>
        </div>

        {/* Statistics Cards - Guest View (Read Only) */}
        <div className="stats stats-vertical lg:stats-horizontal shadow mb-8 w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C20.832 18.477 19.247 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div className="stat-title">Total Buku</div>
            <div className="stat-value text-primary">1,247</div>
            <div className="stat-desc">Koleksi lengkap</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div className="stat-title">Tersedia</div>
            <div className="stat-value text-secondary">1,058</div>
            <div className="stat-desc">Siap dipinjam</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <div className="stat-title">Kategori</div>
            <div className="stat-value text-info">24</div>
            <div className="stat-desc">Beragam bidang</div>
          </div>
          
          <div className="stat">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
            <div className="stat-title">Jam Buka</div>
            <div className="stat-value text-accent text-lg">08-17</div>
            <div className="stat-desc">Senin - Jumat</div>
          </div>
        </div>        {/* Guest Actions - Show Available Features Only */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-base-content">Layanan Perpustakaan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Access - Book Search */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-base-content">🔍 Cari Buku</h2>
                <p className="text-base-content opacity-70">Browse dan cari koleksi buku yang tersedia di perpustakaan</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">
                    Mulai Mencari
                  </button>
                </div>
              </div>
            </div>
            
            {/* Show Library Info */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-base-content">📚 Koleksi Buku</h2>
                <p className="text-base-content opacity-70">Lihat daftar koleksi terbaru dan populer di perpustakaan</p>
                <div className="card-actions justify-end">
                  <button className="btn btn-secondary">
                    Lihat Koleksi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>        {/* Book Collection Preview */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-base-content">Koleksi Populer</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Book 1 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-base-content text-sm">Algoritma dan Struktur Data</h2>
                <p className="text-xs text-base-content opacity-70">Rinaldi Munir</p>
                <p className="text-xs text-base-content opacity-60">Informatika • 2019</p>
                <div className="card-actions justify-between items-center mt-2">
                  <div className="badge badge-success badge-sm">Tersedia</div>
                  <button 
                    className="btn btn-primary btn-xs"
                    onClick={() => handleRestrictedAction('borrow')}
                  >
                    Pinjam
                  </button>
                </div>
              </div>
            </div>

            {/* Book 2 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-base-content text-sm">Machine Learning</h2>
                <p className="text-xs text-base-content opacity-70">Tom Mitchell</p>
                <p className="text-xs text-base-content opacity-60">Computer Science • 2017</p>
                <div className="card-actions justify-between items-center mt-2">
                  <div className="badge badge-success badge-sm">Tersedia</div>
                  <button 
                    className="btn btn-primary btn-xs"
                    onClick={() => handleRestrictedAction('borrow')}
                  >
                    Pinjam
                  </button>
                </div>
              </div>
            </div>

            {/* Book 3 */}
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <h2 className="card-title text-base-content text-sm">Kalkulus dan Geometri Analitik</h2>
                <p className="text-xs text-base-content opacity-70">Purcell & Varberg</p>
                <p className="text-xs text-base-content opacity-60">Matematika • 2018</p>
                <div className="card-actions justify-between items-center mt-2">
                  <div className="badge badge-warning badge-sm">2 tersisa</div>
                  <button 
                    className="btn btn-primary btn-xs"
                    onClick={() => handleRestrictedAction('borrow')}
                  >
                    Pinjam
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Public Info */}
        <div className="bg-base-100 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-base-content">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-base-200">
              <div className="w-2 h-2 bg-success rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-base-content">Koleksi buku baru "Introduction to Data Science" tersedia</p>
                <p className="text-sm text-base-content opacity-60">
                  2 hours ago
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-base-200">
              <div className="w-2 h-2 bg-info rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-base-content">Perpustakaan menambah 50 judul buku baru bulan ini</p>
                <p className="text-sm text-base-content opacity-60">
                  1 day ago
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-base-200">
              <div className="w-2 h-2 bg-warning rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-base-content">Jam operasional perpustakaan diperpanjang sampai 18:00</p>
                <p className="text-sm text-base-content opacity-60">
                  3 days ago
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Library Information */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-base-content">📍 Informasi Perpustakaan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base-content opacity-70">
              <div>
                <p><strong>Alamat:</strong> Gedung FMIPA Universitas Hasanuddin</p>
                <p><strong>Jam Buka:</strong> 08:00 - 17:00 (Senin - Jumat)</p>
              </div>
              <div>
                <p><strong>Email:</strong> perpusmipa@unhas.ac.id</p>
                <p><strong>Telepon:</strong> (0411) 586200</p>
              </div>
            </div>
          </div>
        </div>
      </main>      {/* Login Modal */}
      <dialog id="login_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-base-content">Masuk ke Akun Anda</h3>
          <p className="py-4 text-base-content opacity-70">
            Untuk meminjam buku, silakan masuk ke akun perpustakaan Anda terlebih dahulu.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost mr-2">Batal</button>
              <button 
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('login_modal').close();
                  onLogin();
                }}
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}

export default GuestHome
