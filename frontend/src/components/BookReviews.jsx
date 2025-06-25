import React, { useState, useEffect } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { reviewsAPI, booksAPI } from '../services/api'

function BookReviews({ bookId }) {
  const [reviews, setReviews] = useState([])
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState({
    review_score: 5,
    review_text: ''
  })
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (bookId) {
      fetchBookAndReviews()
    }
  }, [bookId])

  const fetchBookAndReviews = async () => {
    try {
      setLoading(true)
      const [bookData, reviewsData] = await Promise.all([
        booksAPI.getBook(bookId),
        reviewsAPI.getReviewsForBook(bookId)
      ])
      setBook(bookData)
      setReviews(reviewsData)
    } catch (error) {
      console.error('Error fetching book and reviews:', error)
      showNotification('Gagal memuat data: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    try {
      await reviewsAPI.createReview(bookId, newReview)
      showNotification('Review berhasil ditambahkan!')
      setNewReview({ review_score: 5, review_text: '' })
      setShowForm(false)
      await fetchBookAndReviews() // Refresh reviews
    } catch (error) {
      console.error('Error creating review:', error)
      showNotification('Gagal menambahkan review: ' + error.message, 'error')
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

  return (
    <div className="max-w-4xl mx-auto">
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

      {/* Book Header */}
      {book && (
        <div className="bg-white rounded-lg shadow border border-red-100 p-6 mb-6">
          <div className="flex gap-4">
            {book.image_blob && (
              <img 
                src={`data:image/jpeg;base64,${book.image_blob}`} 
                alt={book.title}
                className="w-24 h-32 object-cover rounded-lg shadow"
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h1>
              {/* Hapus deskripsi buku dari header review */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-sm text-gray-600">
                    {averageRating} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                {showForm ? 'Batal Review' : 'Tulis Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Form (Comment Box) */}
      {showForm && (
        <div className="bg-white rounded-lg shadow border border-red-100 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Tulis Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Rating</label>
              {renderStars(newReview.review_score, true, (rating) => 
                setNewReview({ ...newReview, review_score: rating })
              )}
            </div>
            {/* Custom Comment Box */}
            <div className="relative">
              <textarea
                value={newReview.review_text}
                onChange={(e) => setNewReview({ ...newReview, review_text: e.target.value })}
                placeholder="Berikan ulasan"
                rows={4}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 pr-12 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300 resize-none text-base"
                style={{ minHeight: '80px' }}
              />
              <button
                type="submit"
                className="absolute bottom-2 right-2 p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Kirim Komentar"
              >
                <PaperAirplaneIcon className="h-6 w-6 text-gray-400 rotate-90" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow border border-red-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Review ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada review untuk buku ini.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{review.owner.full_name}</span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-500 text-sm">
                    {(() => {
                      const date = new Date(review.created_at);
                      return isNaN(date.getTime())
                        ? '-' 
                        : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });
                    })()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  {renderStars(review.review_score)}
                  <span className="text-sm text-gray-600">({review.review_score}/5)</span>
                </div>
                {review.review_text && (
                  <p className="text-gray-700 mt-2 whitespace-pre-line">{review.review_text}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BookReviews
