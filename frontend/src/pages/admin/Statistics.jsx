import React, { useState, useEffect } from 'react'
import NavbarAdmin from '../../components/NavbarAdmin'
import { statisticsAPI } from '../../services/api'
import { BookOpenIcon, UsersIcon, ClipboardDocumentListIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

function Statistics({ onLogout }) {
  const [stats, setStats] = useState({
    total_books: 0,
    total_users: 0,
    total_borrows: 0,
    active_borrows: 0
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
      showNotification('Gagal memuat data statistik: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
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
      label: 'Total Buku', 
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
      label: 'Total Peminjaman', 
      value: stats.total_borrows, 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      icon: <ClipboardDocumentListIcon className="h-7 w-7" />
    },
    { 
      label: 'Peminjaman Aktif', 
      value: stats.active_borrows, 
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: <ArrowPathIcon className="h-7 w-7" />
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded shadow-lg z-50 animate-fade-in ${
          notification.type === 'error' 
            ? 'bg-red-100 border border-red-400 text-red-700' 
            : 'bg-green-100 border border-green-400 text-green-700'
        }`}>
          {notification.message}
        </div>
      )}

      <NavbarAdmin onLogout={onLogout} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-red-800 tracking-tight drop-shadow-sm mb-8">
          Statistik & Dashboard
        </h1>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data statistik...</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {statsConfig.map((stat, i) => (
                <div key={i} className={`rounded-lg border shadow-sm p-6 flex flex-col items-center ${stat.color}`}>
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-extrabold mb-1">{stat.value}</div>
                  <div className="text-base font-semibold opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Borrows Chart */}
              <div className="bg-white rounded-lg shadow border border-red-100 p-6">
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
              <div className="bg-white rounded-lg shadow border border-red-100 p-6">
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

            {/* Additional Stats */}
            <div className="bg-white rounded-lg shadow border border-red-100 p-6">
              <h2 className="text-xl font-bold text-red-700 mb-6">Ringkasan Aktivitas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <BookOpenIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-600">{stats.total_books}</div>
                  <div className="text-sm text-gray-600">Total Koleksi Buku</div>
                </div>
                <div className="text-center">
                  <ArrowPathIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-600">{stats.active_borrows}</div>
                  <div className="text-sm text-gray-600">Sedang Dipinjam</div>
                </div>
                <div className="text-center">
                  <CheckCircleIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-600">{stats.total_borrows - stats.active_borrows}</div>
                  <div className="text-sm text-gray-600">Sudah Dikembalikan</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Statistics
