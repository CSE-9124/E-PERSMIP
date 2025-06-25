import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavbarUser from '../../components/NavbarUser'
import BookReviews from '../../components/BookReviews'
import { booksAPI, borrowsAPI } from '../../services/api'

function BookDetail({ onLogout }) {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [notification, setNotification] = useState(null)

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
      showNotification('Gagal memuat detail buku: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleBorrowBook = async () => {
    try {
      setBorrowing(true)
      await borrowsAPI.borrowBook(bookId)
      showNotification('Buku berhasil dipinjam!')
      // Optionally navigate to borrow history
      setTimeout(() => {
        navigate('/user/history')
      }, 1500)
    } catch (error) {
      console.error('Error borrowing book:', error)
      showNotification('Gagal meminjam buku: ' + error.message, 'error')
    } finally {
      setBorrowing(false)
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <NavbarUser onLogout={onLogout} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat detail buku...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <NavbarUser onLogout={onLogout} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center py-8">
            <p className="text-gray-600">Buku tidak ditemukan.</p>
            <button
              onClick={() => navigate('/user/borrow')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Kembali ke Daftar Buku
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
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

      <NavbarUser onLogout={onLogout} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/user/borrow')}
          className="mb-6 flex items-center gap-2 text-red-600 hover:text-red-700 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Buku
        </button>

        {/* Book Details */}
        <div className="bg-white rounded-lg shadow border border-red-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Book Image */}
            <div className="md:col-span-1">
              {book.image ? (
                <img 
                  src={book.image} 
                  alt={book.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                />
              ) : book.image_blob ? (
                <img 
                  src={`data:image/jpeg;base64,${book.image_blob}`} 
                  alt={book.title}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-full max-w-sm mx-auto bg-gray-200 rounded-lg flex items-center justify-center h-64">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{book.title}</h1>
              
              {book.authors && book.authors.length > 0 && (
                <div className="mb-3">
                  <span className="text-sm font-semibold text-gray-600">Penulis: </span>
                  <span className="text-gray-800">{book.authors.map(a => a.name).join(', ')}</span>
                </div>
              )}

              {book.categories && book.categories.length > 0 && (
                <div className="mb-3">
                  <span className="text-sm font-semibold text-gray-600">Kategori: </span>
                  <div className="inline-flex flex-wrap gap-2 mt-1">
                    {book.categories.map((category) => (
                      <span key={category.id} className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {book.publisher && (
                <div className="mb-3">
                  <span className="text-sm font-semibold text-gray-600">Penerbit: </span>
                  <span className="text-gray-800">{book.publisher}</span>
                </div>
              )}

              <div className="mb-4">
                <span className="text-sm font-semibold text-gray-600">Stok Tersedia: </span>
                <span className={`font-bold ${book.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {book.amount} eksemplar
                </span>
              </div>

              {book.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Deskripsi</h3>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleBorrowBook}
                  disabled={borrowing || book.amount === 0}
                  className={`px-6 py-3 rounded-lg font-semibold transition ${
                    book.amount > 0 && !borrowing
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {borrowing ? 'Meminjam...' : book.amount > 0 ? 'Pinjam Buku' : 'Stok Habis'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Ulasan & Komentar
            </h2>
          </div>
          <div className="p-8">
            <BookReviews bookId={Number.parseInt(bookId)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
