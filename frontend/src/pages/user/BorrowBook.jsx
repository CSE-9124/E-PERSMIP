import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarUser from '../../components/NavbarUser'
import Footer from '../../components/Footer'
import { BookOpenIcon, FunnelIcon, EyeIcon, MagnifyingGlassIcon, SparklesIcon } from '@heroicons/react/24/solid'
import { booksAPI, borrowsAPI } from '../../services/api'
import bookImg from '../../assets/react.svg'

function BorrowBook({ onLogout }) {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [borrowing, setBorrowing] = useState(null)

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await booksAPI.getAllBooks()
        setBooks(data)
      } catch (err) {
        setError('Gagal memuat data buku')
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  // Filter buku berdasarkan search dan filterType
  const filteredBooks = books.filter(b => {
    const searchValue = search.toLowerCase()
    if (!searchValue) return true
    if (filterType === 'Semua') {
      return (
        b.title.toLowerCase().includes(searchValue) ||
        (b.authors?.some(a => a.name.toLowerCase().includes(searchValue))) ||
        (b.categories?.some(c => c.name.toLowerCase().includes(searchValue)))
      )
    } else if (filterType === 'Kategori') {
      return (b.categories?.some(c => c.name.toLowerCase().includes(searchValue)))
    } else if (filterType === 'Penulis') {
      return (b.authors?.some(a => a.name.toLowerCase().includes(searchValue)))
    } else if (filterType === 'Judul') {
      return b.title.toLowerCase().includes(searchValue)
    }
    return true
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const booksPerPage = 8
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage)
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage)

  // Reset to page 1 if filter/search changes
  useEffect(() => { setCurrentPage(1) }, [search, filterType])
  const handlePinjamBuku = async (book) => {
    if (book.amount <= 0) {
      alert('Buku tidak tersedia!')
      return
    }
    
    setBorrowing(book.id)
    try {
      await borrowsAPI.borrowBook(book.id)
      alert(`Berhasil meminjam: ${book.title}`)
      // Refresh data buku
      const updatedBooks = await booksAPI.getAllBooks()
      setBooks(updatedBooks)
    } catch (err) {
      if (err.message.includes('tidak aktif')) {
        alert('Akun Anda tidak aktif. Silakan hubungi administrator untuk mengaktifkan akun Anda.')
      } else {
        alert(`Gagal meminjam buku: ${err.message}`)
      }
    } finally {
      setBorrowing(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <NavbarUser onLogout={onLogout} />      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Professional Header Section */}
        <div className="mb-12 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <SparklesIcon className="h-8 w-8 text-red-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Koleksi Perpustakaan
              </h1>
            </div>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Temukan dan pinjam buku dari koleksi Perpustakaan MIPA Universitas Hasanuddin
            </p>
            
            {/* Search & Filter Section */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center max-w-4xl mx-auto">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[300px] max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-6 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  placeholder={`Cari ${filterType.toLowerCase()}...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              
              {/* Filter Dropdown */}
              <div className="dropdown dropdown-end">
                <button 
                  tabIndex={0} 
                  className="btn bg-red-600 hover:bg-red-700 text-white border-0 rounded-lg px-6 py-3 font-semibold shadow-md transition-all flex items-center gap-2"
                >
                  <FunnelIcon className="h-5 w-5" />
                  Filter: {filterType}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-white rounded-lg w-48 mt-2 border border-gray-200 z-50">
                  {['Semua', 'Kategori', 'Penulis', 'Judul'].map(type => (
                    <li key={type}>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                          filterType === type 
                            ? 'bg-red-600 text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setFilterType(type)}
                        type="button"
                      >
                        {type}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Results Counter */}
            <div className="mt-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-700 font-medium">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                {filteredBooks.length} buku ditemukan
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">Memuat koleksi buku...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 text-lg font-semibold">{error}</p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && (
          <>
            {filteredBooks.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <BookOpenIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada buku ditemukan</h3>
                <p className="text-gray-600">Coba ubah kata kunci pencarian atau filter kategori</p>
              </div>
            ) : (
              <>                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedBooks.map(book => (
                    <div 
                      key={book.id} 
                      className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
                    >
                      {/* Book Image */}
                      <div className="relative h-64 bg-gray-100 overflow-hidden">
                        {book.image ? (
                          <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : book.image_blob ? (
                          <img src={URL.createObjectURL(book.image_blob)} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                        
                        {/* Availability Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            book.amount > 0 
                              ? 'bg-green-500 text-white' 
                              : 'bg-red-500 text-white'
                          }`}>
                            {book.amount > 0 ? `${book.amount} tersedia` : 'Tidak tersedia'}
                          </span>
                        </div>
                      </div>

                      {/* Book Info */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                          {book.title}
                        </h3>
                        
                        {book.authors?.length > 0 && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                            oleh {book.authors.map(a => a.name).join(', ')}
                          </p>
                        )}
                        
                        {/* Categories */}
                        {book.categories?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {book.categories.slice(0, 2).map(cat => (
                              <span 
                                key={cat.name} 
                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium"
                              >
                                {cat.name}
                              </span>
                            ))}
                            {book.categories.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                +{book.categories.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                            onClick={() => navigate(`/user/book/${book.id}`)}
                          >
                            <EyeIcon className="h-4 w-4" />
                            Detail
                          </button>
                          
                          <button
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              book.amount > 0 
                                ? 'bg-red-600 hover:bg-red-700 text-white' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                            onClick={() => handlePinjamBuku(book)}
                            disabled={book.amount <= 0 || borrowing === book.id}
                          >
                            {borrowing === book.id ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></div>
                                <span className="text-xs">Meminjam...</span>
                              </div>
                            ) : book.amount > 0 ? (
                              <div className="flex items-center justify-center gap-1">
                                <BookOpenIcon className="h-4 w-4" />
                                Pinjam
                              </div>
                            ) : (
                              'Tidak Tersedia'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>{/* Enhanced Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">
                    <button
                      className="btn bg-white/80 backdrop-blur-md border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 rounded-xl px-6 py-3 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      ← Sebelumnya
                    </button>
                    
                    {/* Smart Pagination: show first, last, current, neighbors, and ellipsis */}
                    <div className="flex items-center gap-2">
                      {(() => {
                        const pageButtons = [];
                        const pageRange = 2; // show 2 before/after current
                        let start = Math.max(2, currentPage - pageRange);
                        let end = Math.min(totalPages - 1, currentPage + pageRange);
                          // Always show first page
                        pageButtons.push(
                          <button
                            key={1}
                            className={`btn rounded-xl font-bold px-4 py-3 shadow-lg transition-all ${
                              currentPage === 1 
                                ? 'bg-red-600 text-white border-0' 
                                : 'bg-white/80 backdrop-blur-md text-red-700 border-2 border-red-200 hover:bg-red-50'
                            }`}
                            onClick={() => setCurrentPage(1)}
                          >
                            1
                          </button>
                        );
                        
                        // Ellipsis before
                        if (start > 2) {
                          pageButtons.push(
                            <span key="start-ellipsis" className="px-2 text-gray-400 font-bold">...</span>
                          );
                        }
                          // Middle pages
                        for (let i = start; i <= end; i++) {
                          pageButtons.push(
                            <button
                              key={i}
                              className={`btn rounded-xl font-bold px-4 py-3 shadow-lg transition-all ${
                                currentPage === i 
                                  ? 'bg-red-600 text-white border-0' 
                                  : 'bg-white/80 backdrop-blur-md text-red-700 border-2 border-red-200 hover:bg-red-50'
                              }`}
                              onClick={() => setCurrentPage(i)}
                            >
                              {i}
                            </button>
                          );
                        }
                        
                        // Ellipsis after
                        if (end < totalPages - 1) {
                          pageButtons.push(
                            <span key="end-ellipsis" className="px-2 text-gray-400 font-bold">...</span>
                          );
                        }
                          // Always show last page if more than 1
                        if (totalPages > 1) {
                          pageButtons.push(
                            <button
                              key={totalPages}
                              className={`btn rounded-xl font-bold px-4 py-3 shadow-lg transition-all ${
                                currentPage === totalPages 
                                  ? 'bg-red-600 text-white border-0' 
                                  : 'bg-white/80 backdrop-blur-md text-red-700 border-2 border-red-200 hover:bg-red-50'
                              }`}
                              onClick={() => setCurrentPage(totalPages)}
                            >
                              {totalPages}
                            </button>
                          );
                        }
                        
                        return pageButtons;
                      })()}
                    </div>
                    
                    <button
                      className="btn bg-white/80 backdrop-blur-md border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 rounded-xl px-6 py-3 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Berikutnya →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default BorrowBook