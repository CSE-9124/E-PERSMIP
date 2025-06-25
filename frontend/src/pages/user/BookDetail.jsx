import React from 'react'
import NavbarUser from '../../components/NavbarUser'
import BookDetailContent from '../../components/BookDetailContent'

function BookDetail({ onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <NavbarUser onLogout={onLogout} />
      <BookDetailContent 
        userType="user" 
        onLogout={onLogout}
        showBorrowButton={true} 
        showReviews={true} 
      />
    </div>
  )
}

export default BookDetail
