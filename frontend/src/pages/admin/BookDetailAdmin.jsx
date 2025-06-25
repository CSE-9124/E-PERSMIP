import React from 'react'
import NavbarAdmin from '../../components/NavbarAdmin'
import BookDetailContent from '../../components/BookDetailContent'

function BookDetailAdmin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <NavbarAdmin />
      <BookDetailContent 
        userType="admin" 
        showBorrowButton={false} 
        showReviews={false} 
      />
    </div>
  )
}

export default BookDetailAdmin
