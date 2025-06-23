import React from 'react'
import unhasLogo from '../assets/unhas-logo.png'

function NavbarUser({ onLogout }) {
  return (
    <header className="bg-gradient-to-r from-red-700 via-red-600 to-pink-500 shadow-xl rounded-b-3xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5 md:py-7">
          <div className="flex items-center space-x-4">
            <img src={unhasLogo} alt="Universitas Hasanuddin Logo" className="h-12 w-12 md:h-14 md:w-14 object-contain drop-shadow-lg bg-white rounded-2xl p-1" />
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-wide drop-shadow">E-PERSMIP</h1>
              <p className="text-sm md:text-base text-white opacity-90 font-medium">Universitas Hasanuddin</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white font-semibold capitalize text-base md:text-lg bg-red-900 bg-opacity-30 px-3 py-1 rounded-xl">Mahasiswa</span>
            <button
              onClick={onLogout}
              className="bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white btn-sm shadow-md font-bold px-5 py-2 rounded-xl transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavbarUser
