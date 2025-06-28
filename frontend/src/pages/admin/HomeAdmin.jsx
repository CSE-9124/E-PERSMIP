import React, { useState, useEffect } from 'react'
import NavbarAdmin from '../../components/NavbarAdmin'
import Footer from '../../components/Footer'
import { useNavigate } from 'react-router-dom'
import { BookOpenIcon, UsersIcon, ChartBarIcon, ClipboardDocumentListIcon, ArrowPathIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/solid'
import { statisticsAPI } from '../../services/api'
import unhasLogo from '../../assets/unhas-logo.png'

function HomeAdmin({ onLogout }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    total_books: 0,
    total_users: 0,
    total_borrows: 0,
    pending_borrows: 0,
    active_borrows: 0,
    returned_borrows: 0,
    rejected_borrows: 0
  })
  const [monthlyData, setMonthlyData] = useState([])
  const [popularBooks, setPopularBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)

      // Fetch all statistics data
      const [summaryData, monthlyBorrows, popularBooksData] = await Promise.all([
        statisticsAPI.getSummary(),
        statisticsAPI.getBorrowsByMonth(),
        statisticsAPI.getPopularBooks(5)
      ])

      setStats(summaryData)
      setMonthlyData(monthlyBorrows.monthly_borrows || [])
      setPopularBooks(popularBooksData.popular_books || [])

    } catch (error) {
      console.error('Error fetching statistics:', error)
      // showNotification('Gagal memuat data statistik: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Convert month data for chart display
  const chartData = monthlyData.length > 0 ? monthlyData.slice(-12) : [] // Last 12 months
  const maxVal = chartData.length > 0 ? Math.max(...chartData.map(d => d.count)) : 1

  const formatMonth = (monthStr) => {
    if (!monthStr) return ''
    const [year, month] = monthStr.split('-')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    return monthNames[parseInt(month) - 1] || month
  }

  const statsConfig = [
    { 
      label: 'Total Koleksi Buku', 
      value: stats.total_books, 
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: <BookOpenIcon className="h-7 w-7" />
    },
    { 
      label: 'Total User', 
      value: stats.total_users, 
      color: 'bg-pink-100 text-pink-700 border-pink-200',
      icon: <UsersIcon className="h-7 w-7" />
    },
    { 
      label: 'Menunggu Persetujuan', 
      value: stats.pending_borrows, 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: <ClockIcon className="h-7 w-7" />
    },
    { 
      label: 'Sedang Dipinjam', 
      value: stats.active_borrows, 
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: <ArrowPathIcon className="h-7 w-7" />
    },
    { 
      label: 'Sudah Dikembalikan', 
      value: stats.returned_borrows, 
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: <CheckCircleIcon className="h-7 w-7" />
    },
    { 
      label: 'Ditolak', 
      value: stats.rejected_borrows, 
      color: 'bg-red-100 text-red-800 border-red-300',
      icon: <XCircleIcon className="h-7 w-7" />
    },
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <NavbarAdmin onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/80 rounded-2xl p-8 mb-10 shadow-2xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold mb-2 text-red-700">Dashboard Admin E-PERSMIP</h2>
            <p className="text-lg text-gray-700 opacity-80">Sistem Elektronik Peminjaman Perpustakaan MIPA Universitas Hasanuddin</p>
            <p className="mt-2 text-base text-gray-500">Anda login sebagai <span className="font-semibold text-red-600">admin</span></p>
          </div>
          <img src={unhasLogo} alt="Logo Unhas" className="h-24 w-24 object-contain opacity-80 hidden md:block" />
        </div>

        {/* Menu Kelola */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="card bg-gradient-to-br from-blue-100 to-purple-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-blue-400">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardDocumentListIcon className="h-7 w-7 text-blue-600" />
                <h2 className="card-title text-blue-700 text-2xl font-bold">Kelola Peminjaman</h2>
              </div>
              <p className="text-gray-600 opacity-80 mb-4">Kelola peminjaman buku mahasiswa</p>
              <div className="card-actions justify-end">
                <button className="btn bg-blue-500 text-white hover:bg-blue-600 font-semibold px-6 py-2 rounded-xl shadow" onClick={() => navigate('/admin/borrows')}>Kelola Peminjaman</button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data statistik...</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="mb-10">
              <h3 className="text-2xl font-bold mb-6 text-red-700 flex items-center gap-2">
                <ChartBarIcon className="h-8 w-8" />
                Ringkasan Aktivitas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {statsConfig.map((stat, i) => (
                  <div key={i} className={`rounded-lg border shadow-sm p-6 flex flex-col items-center ${stat.color}`}>
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-3xl font-extrabold mb-1">{stat.value}</div>
                    <div className="text-base font-semibold opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Borrows Chart */}
              <div className="bg-white/90 rounded-2xl shadow-xl border border-red-100 p-6">
                <h2 className="text-xl font-bold text-red-700 mb-6">Grafik Peminjaman per Bulan</h2>
                {chartData.length > 0 ? (
                  <div className="flex items-end gap-2 h-48 w-full overflow-x-auto">
                    {chartData.map((d, i) => (
                      <div key={i} className="flex flex-col items-center min-w-[30px]">
                        <div
                          className="w-full rounded-t-lg bg-red-400 transition-all hover:bg-red-500"
                          style={{ height: `${(d.count / maxVal) * 140 + 10}px` }}
                          title={`${formatMonth(d.month)}: ${d.count} peminjaman`}
                        ></div>
                        <span className="text-xs mt-2 text-gray-500">{formatMonth(d.month)}</span>
                        <span className="text-xs text-gray-700 font-semibold">{d.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Belum ada data peminjaman
                  </div>
                )}
              </div>

              {/* Popular Books */}
              <div className="bg-white/90 rounded-2xl shadow-xl border border-red-100 p-6">
                <h2 className="text-xl font-bold text-red-700 mb-6">Buku Terpopuler</h2>
                {popularBooks.length > 0 ? (
                  <div className="space-y-4">
                    {popularBooks.map((book, index) => (
                      <div key={book.book_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">{book.title}</h3>
                            <p className="text-xs text-gray-500">ID: {book.book_id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">{book.borrow_count}</div>
                          <div className="text-xs text-gray-500">peminjaman</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    Belum ada data buku terpopuler
                  </div>
                )}
              </div>
            </div>

            {/* Additional Stats - REMOVED: Duplicate section */}
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default HomeAdmin
