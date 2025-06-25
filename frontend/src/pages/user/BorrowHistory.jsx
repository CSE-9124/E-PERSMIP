import React, { useState, useEffect } from 'react'
import NavbarUser from '../../components/NavbarUser'
import { ClockIcon, BookOpenIcon } from '@heroicons/react/24/solid'
import { borrowsAPI } from '../../services/api'

function BorrowHistory({ onLogout }) {
  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [returning, setReturning] = useState(null)

  useEffect(() => {
    const fetchBorrows = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await borrowsAPI.getMyBorrows()
        setBorrows(data)
      } catch (err) {
        setError('Gagal memuat riwayat peminjaman')
      } finally {
        setLoading(false)
      }
    }
    fetchBorrows()
  }, [])

  const handleReturnBook = async (borrowId) => {
    setReturning(borrowId)
    try {
      await borrowsAPI.returnBook(borrowId)
      alert('Buku berhasil dikembalikan!')
      // Refresh data
      const updatedBorrows = await borrowsAPI.getMyBorrows()
      setBorrows(updatedBorrows)
    } catch (err) {
      alert(`Gagal mengembalikan buku: ${err.message}`)
    } finally {
      setReturning(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrowed':
        return 'bg-yellow-100 text-yellow-700'
      case 'returned':
        return 'bg-green-100 text-green-700'
      case 'overdue':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'borrowed':
        return 'Dipinjam'
      case 'returned':
        return 'Dikembalikan'
      case 'overdue':
        return 'Terlambat'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <NavbarUser onLogout={onLogout} />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex items-center justify-center bg-red-100 rounded-xl p-2">
            <ClockIcon className="h-8 w-8 text-red-600" />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-red-700 mb-1">Riwayat Peminjaman</h1>
            <p className="text-gray-600">Lihat semua riwayat peminjaman buku Anda</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Memuat riwayat peminjaman...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-red-100">
            {borrows.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BookOpenIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>Belum ada riwayat peminjaman</p>
              </div>
            ) : (
              <div className="divide-y divide-red-50">
                {borrows.map((borrow) => (
                  <div key={borrow.id} className="p-6 hover:bg-red-50/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-red-700 mb-1">{borrow.book.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">Tanggal Pinjam: {formatDate(borrow.borrow_date)}</p>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(borrow.status)}`}>
                            {getStatusText(borrow.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {borrow.status === 'borrowed' && (
                          <button
                            className="btn btn-sm bg-green-600 text-white hover:bg-green-700"
                            onClick={() => handleReturnBook(borrow.id)}
                            disabled={returning === borrow.id}
                          >
                            {returning === borrow.id ? 'Mengembalikan...' : 'Kembalikan'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BorrowHistory
