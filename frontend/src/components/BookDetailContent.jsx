import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { BookOpenIcon, UserIcon, CalendarIcon, BuildingLibraryIcon, TagIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import BookReviews from './BookReviews'
import { booksAPI, borrowsAPI } from '../services/api'
import { showNotification } from '../utils/notification'

function BookDetailContent({ userType = 'user', onLogout, showBorrowButton = true, showReviews = true }) {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)

  useEffect(() => {
    if (bookId) {
      fetchBook()
    }
  }, [bookId])

  const fetchBook = async () => {
    try {
      setLoading(true)
      const bookData = await booksAPI.getBook(bookId)
      setBook(bookData)
    } catch (error) {
      console.error('Error fetching book:', error)
      showNotification('Tidak dapat memuat detail buku. Silakan refresh halaman atau hubungi petugas perpustakaan.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBorrowBook = async () => {
    try {
      setBorrowing(true)
      await borrowsAPI.borrowBook(bookId)
      showNotification('Buku berhasil dipinjam!', 'success')
      await fetchBook()
    } catch (error) {
      console.error('Error borrowing book:', error)
      if (error.message.includes('tidak aktif')) {
        showNotification('Akun Anda tidak aktif. Silakan hubungi administrator untuk mengaktifkan akun Anda.', 'error')
      } else if (error.message.includes('peminjaman aktif') || error.message.includes('dipinjam')) {
        showNotification('Anda hanya dapat meminjam 1 buku dalam 1 waktu. Kembalikan buku yang sedang dipinjam terlebih dahulu untuk meminjam buku lain.', 'warning')
      } else if (error.message.includes('menunggu persetujuan') || error.message.includes('menunggu')) {
        showNotification('Masih ada peminjaman yang menunggu verifikasi admin. Harap tunggu admin memverifikasi peminjaman sebelumnya.', 'info')
      } else if (error.message.includes('tidak tersedia')) {
        showNotification('Buku ini sedang tidak tersedia untuk dipinjam.', 'warning')
      } else {
        showNotification('Anda hanya dapat meminjam 1 buku dalam 1 waktu. Pastikan tidak ada buku yang sedang dipinjam atau menunggu verifikasi admin sebelum meminjam buku baru.', 'warning')
      }
    } finally {
      setBorrowing(false)
    }
  }

  const handleBack = () => {
    if (userType === 'admin') {
      navigate('/admin/books')
    } else {
      navigate('/user/borrow')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat detail buku...</p>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Buku tidak ditemukan</h2>
          <p className="text-gray-600 mb-6">Buku yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          <button
            onClick={handleBack}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Kembali ke Koleksi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-8 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors group px-5 py-2 rounded-xl shadow"
      >
        <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        Kembali ke {userType === 'admin' ? 'Kelola Buku' : 'Koleksi'}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Book Image */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-red-100">
            <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden mb-6">
              {book.image ? (
                <img src={book.image} alt={book.title} className="w-full h-full object-cover rounded-2xl" />
              ) : book.image_blob ? (
                <img src={URL.createObjectURL(book.image_blob)} alt={book.title} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-2xl">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="text-center mb-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                book.amount > 0 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <BuildingLibraryIcon className="h-4 w-4 mr-2" />
                {book.amount > 0 ? `${book.amount} eksemplar tersedia` : 'Tidak tersedia'}
              </span>
            </div>            {/* Borrow Button (only for users) */}
            {userType === 'user' && showBorrowButton && (
              <button
                onClick={handleBorrowBook}
                disabled={book.amount <= 0 || borrowing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  book.amount > 0 && !borrowing
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {borrowing ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-r-transparent"></div>
                    Meminjam...
                  </div>
                ) : book.amount > 0 ? (
                  <div className="flex items-center justify-center gap-2">
                    <BookOpenIcon className="h-5 w-5" />
                    Pinjam Buku Ini
                  </div>
                ) : (
                  'Tidak Tersedia'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-red-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {book.title || 'Buku Ini Tidak Memiliki Judul'}
            </h1>

            {/* Authors */}
            <div className="flex items-center gap-2 mb-6">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <span className="text-md text-gray-700">
                {book.authors.map(author => author.name).join(', ') || '-'}
              </span>
            </div>

            {/* Categories */}
            <div className="flex items-start gap-2 mb-6">
              <TagIcon className="h-5 w-5 text-gray-500 mt-1" />
              <div className="flex flex-wrap gap-2">
                {book.categories && book.categories.length > 0 ? (
                  book.categories.map(category => (
                    <span
                      key={category.name}
                      className="px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-700 rounded-full text-sm font-semibold border border-red-200"
                    >
                      {category.name}
                    </span>
                  ))
                  ) : (
                    <span className="text-md text-gray-700">-</span>
                )}
              </div>
            </div>

            {/* Publisher and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Penerbit</h3>
                <p className="text-md text-gray-700">{book.publisher || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Tanggal Terbit</h3>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-gray-700" />
                  <p className="text-md text-gray-700">{formatDate(book.published_date)}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Deskripsi</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 text-md leading-relaxed whitespace-pre-wrap">
                  {book.description || '-'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Reviews Section (only for users) */}
      {userType === 'user' && showReviews && (
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-red-100">
          <BookReviews bookId={bookId} />
        </div>
      )}
    </div>
  )
}

export default BookDetailContent
