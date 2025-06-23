// Example of DaisyUI components you can use in this file:
// - btn (button)
// - card 
// - stats
// - navbar
// - drawer
// - modal
// - hero
// - badge
// - loading
// Documentation: https://daisyui.com/

import React from 'react'
import unhasLogo from '../assets/unhas-logo.png'

// Hapus percabangan role, cukup tampilkan info role saja jika perlu
function Home({ onLogout, role }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-red-600 shadow-lg">        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <img 
                src={unhasLogo} 
                alt="Universitas Hasanuddin Logo" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold text-white">E-PERSMIP</h1>
                <p className="text-sm text-white opacity-80">Universitas Hasanuddin</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white font-semibold mr-2 capitalize">{role}</span>
              <button 
                onClick={onLogout}
                className="btn bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white btn-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-red-700">Welcome to E-PERSMIP Dashboard</h2>
          <p className="text-lg text-gray-700 opacity-70">
            Sistem Elektronik Peminjaman Perpustakaan MIPA Universitas Hasanuddin
          </p>
          <p className="mt-2 text-base text-gray-500">Anda login sebagai <span className="font-semibold text-red-600">{role}</span></p>
        </div>
      </main>
    </div>
  )
}

export default Home
