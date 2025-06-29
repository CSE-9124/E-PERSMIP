import React, { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { PaperAirplaneIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { reviewsAPI, booksAPI, authAPI, borrowsAPI } from '../services/api'
import { showNotification } from '../utils/notification'

function BookReviews({ bookId, canAddReview = true }) {
  const [reviews, setReviews] = useState([])
  const [book, setBook] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [userReview, setUserReview] = useState(null)
  const [userBorrowHistory, setUserBorrowHistory] = useState([])
  const [canUserReview, setCanUserReview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newReview, setNewReview] = useState({
    review_score: 5,
    review_text: ''
  })
  const [notification, setNotification] = useState(null)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    if (bookId) {
      fetchBookAndReviews()
    }
  }, [bookId])
  const fetchBookAndReviews = async () => {
    try {
      setLoading(true)
      setFetchError(null)
      const [bookData, reviewsData, userData, borrowsData] = await Promise.all([
        booksAPI.getBook(bookId),
        reviewsAPI.getReviewsForBook(bookId),
        authAPI.getCurrentUser(),
        borrowsAPI.getMyBorrows()
      ])
      setBook(bookData)
      setReviews(reviewsData)
      setCurrentUser(userData)
      setUserBorrowHistory(borrowsData)
      
      // Debug: Log borrow history for this book
      const bookBorrows = borrowsData.filter(borrow => borrow.book.id === parseInt(bookId))
      console.log('Borrow history for book', bookId, ':', bookBorrows)
      console.log('All borrow data:', borrowsData)
      
      // Check if user has borrowed this book and RETURNED it (only returned books can be reviewed)
      const eligibleBorrow = borrowsData.find(borrow => 
        borrow.book.id === parseInt(bookId) && 
        borrow.status === 'dikembalikan'  // Only returned books can be reviewed
      )
      
      console.log('Eligible borrow for review:', eligibleBorrow)
      console.log('Book ID (from URL):', bookId, 'type:', typeof bookId)
      console.log('Looking for book with ID:', parseInt(bookId))
      
      // User can review if they have eligible borrow history AND they are not admin
      const isUserNotAdmin = userData.role !== 'admin'
      setCanUserReview(!!eligibleBorrow && isUserNotAdmin)
      
      // Find user's existing review
      const existingReview = reviewsData.find(review => review.owner.id === userData.id)
      setUserReview(existingReview)
      
      if (existingReview) {
        setNewReview({
          review_score: existingReview.review_score,
          review_text: existingReview.review_text
        })
      } else {
        // Reset newReview jika tidak ada existing review (setelah dihapus)
        setNewReview({
          review_score: 5,
          review_text: ''
        })
      }
    } catch (error) {
      console.error('Error fetching book and reviews:', error)
      setFetchError(error?.response?.data?.detail || error.message || 'Gagal memuat data review.')
      showNotification('Gagal memuat data: ' + (error?.message || 'Unknown error'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    const duration = type === 'error' ? 5000 : 3000 // Error messages stay longer
    setTimeout(() => setNotification(null), duration)
  }
  const handleSubmitReview = async (e) => {
    e.preventDefault()
    try {
      if (isEditing && userReview) {
        // Update existing review
        await reviewsAPI.updateReview(userReview.id, newReview)
        showNotification('Review berhasil diperbarui!')
        setIsEditing(false)
      } else {
        // Create new review
        await reviewsAPI.createReview(bookId, newReview)
        showNotification('Review berhasil ditambahkan!')
      }
      
      setShowForm(false)
      await fetchBookAndReviews() // Refresh reviews
    } catch (error) {
      console.error('Error saving review:', error)
      const action = isEditing ? 'memperbarui' : 'menambahkan'
      
      // Handle specific error messages
      let errorMessage = error.message
      if (error.response?.status === 400) {
        const detail = error.response?.data?.detail
        if (detail && detail.includes('borrowed')) {
          errorMessage = 'Anda hanya dapat memberikan review setelah mengembalikan buku yang dipinjam.'
        } else if (detail && detail.includes('already reviewed')) {
          errorMessage = 'Anda sudah memberikan review untuk buku ini.'
        } else {
          errorMessage = detail || 'Tidak dapat memberikan review pada buku ini.'
        }
      }
      
      showNotification(`Gagal ${action} review: ${errorMessage}`, 'error')
    }
  }

  const handleEditReview = () => {
    setIsEditing(true)
    setShowForm(true)
  }

  const handleAddNewReview = () => {
    // Check if user can review
    if (!canUserReview) {
      const isAdmin = currentUser?.role === 'admin'
      const message = isAdmin 
        ? 'Admin tidak dapat memberikan review.' 
        : 'Anda hanya dapat memberikan review setelah mengembalikan buku yang dipinjam.'
      showNotification(message, 'error')
      return
    }
    
    setIsEditing(false)
    setNewReview({
      review_score: 5,
      review_text: ''
    })
    setShowForm(true)
  }

  const handleDeleteReview = async () => {
    if (!userReview || !window.confirm('Apakah Anda yakin ingin menghapus review ini?')) {
      return
    }
    
    try {
      await reviewsAPI.deleteReview(userReview.id)
      showNotification('Review berhasil dihapus!')
      
      // Reset state form setelah delete
      setShowForm(false)
      setIsEditing(false)
      setNewReview({
        review_score: 5,
        review_text: ''
      })
      
      await fetchBookAndReviews() // Refresh reviews
    } catch (error) {
      console.error('Error deleting review:', error)
      showNotification('Gagal menghapus review: ' + error.message, 'error')
    }
  }

  const handleCancelEdit = () => {
    setShowForm(false)
    setIsEditing(false)
    if (userReview) {
      setNewReview({
        review_score: userReview.review_score,
        review_text: userReview.review_text
      })
    } else {
      setNewReview({ review_score: 5, review_text: '' })
    }
  }

  const renderStars = (rating, isInteractive = false, onChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={isInteractive ? "button" : undefined}
            onClick={isInteractive ? () => onChange(star) : undefined}
            className={isInteractive ? "focus:outline-none" : "cursor-default"}
            disabled={!isInteractive}
          >
            {star <= rating ? (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    )
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.review_score, 0) / reviews.length).toFixed(1)
    : 0

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Memuat review...</p>
      </div>
    )
  }
  if (fetchError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 text-3xl mb-2">⚠️</div>
        <p className="text-red-700 font-semibold mb-2">{fetchError}</p>
        <p className="text-gray-500">Tidak dapat menampilkan review buku ini.</p>
      </div>
    )
  }
  // Ubah: Review Statistics Card tetap tampil meski book null
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
          notification.type === 'error' 
            ? 'bg-red-50 border-l-4 border-red-500 text-red-800' 
            : 'bg-green-50 border-l-4 border-green-500 text-green-800'
        }`}>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-3 ${
              notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
            }`}></div>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Review Statistics Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Review & Rating</h2>
              <p className="text-sm text-gray-600">Berikan penilaian untuk buku "{book ? book.title : ''}"</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-red-600">{averageRating}</div>
              <div className="text-sm text-gray-500">dari 5.0</div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {renderStars(Math.round(averageRating))}
              <span className="text-sm font-medium text-gray-600">
                {reviews.length} ulasan
              </span>
            </div>
            
            {/* Review Action Buttons (only if canAddReview) */}
            {canAddReview && (
              <div className="flex items-center gap-2">
                {userReview && !showForm ? (
                  // Show edit/delete buttons if user already has a review
                  <>
                    <button
                      onClick={handleEditReview}
                      className="px-4 py-2 rounded-lg font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 flex items-center gap-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit Review
                    </button>
                    <button
                      onClick={handleDeleteReview}
                      className="px-4 py-2 rounded-lg font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200 flex items-center gap-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Hapus
                    </button>
                  </>
                ) : (
                  // Show write/cancel button if no review exists or form is showing
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={showForm ? handleCancelEdit : handleAddNewReview}
                      className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        showForm 
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                          : canUserReview
                            ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!canUserReview && !showForm}
                    >
                      {showForm ? 'Batal' : '+ Tulis Review'}
                    </button>
                    {!canUserReview && !showForm && (
                      <span className="text-xs text-gray-500 max-w-48 text-right">
                        {currentUser?.role === 'admin' 
                          ? 'Admin tidak dapat memberikan review' 
                          : 'Review hanya bisa diberikan setelah buku dikembalikan'
                        }
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Review Form (only if canAddReview and user can review) */}
          {canAddReview && showForm && canUserReview && (
            <div className="border-t border-gray-100 pt-6 mt-4">
              <h4 className="text-lg font-bold text-gray-800 mb-4">
                {isEditing ? 'Edit Review Anda' : 'Tulis Review Baru'}
              </h4>
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-800">Berikan Rating</label>
                  <div className="flex items-center gap-1">
                    {renderStars(newReview.review_score, true, (rating) => 
                      setNewReview({ ...newReview, review_score: rating })
                    )}
                    <span className="ml-2 text-sm font-medium text-gray-600">
                      ({newReview.review_score}/5)
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-800">Tulis Ulasan</label>
                  <div className="relative">
                    <textarea
                      value={newReview.review_text}
                      onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                      placeholder="Bagikan pengalaman Anda tentang buku ini..."
                      rows={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all duration-200 text-gray-800 bg-gray-50 placeholder-gray-400 resize-none"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute bottom-3 right-3 p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md"
                      aria-label={isEditing ? "Update Review" : "Kirim Review"}
                    >
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-red-600 rounded-full"></span>
            Semua Review ({reviews.length})
          </h3>
        </div>
        
        <div className="p-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarOutlineIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-2">Belum ada review</p>
              {!canAddReview ? null : canUserReview ? (
                <p className="text-sm text-gray-400">Jadilah yang pertama memberikan review untuk buku ini</p>
              ) : currentUser?.role === 'admin' ? (
                <p className="text-sm text-gray-400">Admin tidak dapat memberikan review</p>
              ) : (
                <p className="text-sm text-gray-400">Review hanya bisa diberikan setelah buku dikembalikan</p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div key={review.id} className={`pb-6 ${index !== reviews.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.owner.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">{review.owner.full_name}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-sm text-gray-500">
                          {(() => {
                            const date = new Date(review.created_at);
                            return isNaN(date.getTime())
                              ? '-' 
                              : date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                          })()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(review.review_score)}
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                          {review.review_score}/5
                        </span>
                      </div>
                      
                      {review.review_text && (
                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-200">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-line">{review.review_text}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookReviews
