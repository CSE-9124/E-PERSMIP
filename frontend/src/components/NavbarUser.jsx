import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'
import unhasLogo from '../assets/unhas-logo.png'

function NavbarUser({ onLogout }) {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const isActive = (path) => location.pathname === path

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

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
          
          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/user/home" 
              className={`text-white font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/user/home') ? 'bg-red-900 bg-opacity-50' : 'hover:bg-red-900 hover:bg-opacity-30'
              }`}
            >
              Beranda
            </Link>
            <Link 
              to="/user/borrow" 
              className={`text-white font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/user/borrow') ? 'bg-red-900 bg-opacity-50' : 'hover:bg-red-900 hover:bg-opacity-30'
              }`}
            >
              Pinjam Buku
            </Link>
            <Link 
              to="/user/history" 
              className={`text-white font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive('/user/history') ? 'bg-red-900 bg-opacity-50' : 'hover:bg-red-900 hover:bg-opacity-30'
              }`}
            >
              Riwayat Peminjaman
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-white font-semibold capitalize text-base md:text-lg bg-red-900 bg-opacity-30 px-3 py-1 rounded-xl">Mahasiswa</span>
            <button
              onClick={onLogout}
              className="hidden sm:block bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white btn-sm shadow-md font-bold px-5 py-2 rounded-xl transition-all duration-200"
            >
              Logout
            </button>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-white p-2"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/user/home" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-white font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/user/home') ? 'bg-red-900 bg-opacity-50' : 'hover:bg-red-900 hover:bg-opacity-30'
                }`}
              >
                Beranda
              </Link>
              <Link 
                to="/user/borrow" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-white font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/user/borrow') ? 'bg-red-900 bg-opacity-50' : 'hover:bg-red-900 hover:bg-opacity-30'
                }`}
              >
                Pinjam Buku
              </Link>
              <Link 
                to="/user/history" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-white font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive('/user/history') ? 'bg-red-900 bg-opacity-50' : 'hover:bg-red-900 hover:bg-opacity-30'
                }`}
              >
                Riwayat Peminjaman
              </Link>
              <div className="flex flex-col space-y-2 pt-2 border-t border-red-600">
                <span className="text-white font-semibold text-center py-2">Mahasiswa</span>
                <button
                  onClick={onLogout}
                  className="bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-bold px-5 py-2 rounded-xl transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default NavbarUser
