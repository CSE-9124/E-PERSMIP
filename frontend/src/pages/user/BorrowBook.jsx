import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarUser from '../../components/NavbarUser'
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
      alert(`Gagal meminjam buku: ${err.message}`)
    } finally {
      setBorrowing(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <NavbarUser onLogout={onLogout} />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter & Search Section */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Koleksi Buku</h2>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                {filteredBooks.length} buku
              </span>
            </div>
            <div className="flex gap-3 w-full md:w-auto items-center">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[260px] max-w-md">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder-gray-500 text-base focus:ring-4 focus:ring-white/30 focus:outline-none shadow-xl"
                  placeholder={`Cari ${filterType.toLowerCase()}...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {/* Filter Type Dropdown */}
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-outline border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 rounded-xl px-6 flex items-center gap-2">
                  <FunnelIcon className="h-5 w-5" />
                  {filterType}
                </button>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-white rounded-2xl w-44 mt-2 border border-gray-100 z-50">
                  {['Semua', 'Kategori', 'Penulis', 'Judul'].map(type => (
                    <li key={type}>
                      <button
                        className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-200 ${filterType === type ? 'bg-red-600 text-white font-semibold' : 'hover:bg-red-50 text-gray-700'}`}
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {paginatedBooks.map(book => (
                    <div 
                      key={book.id} 
                      className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-2"
                    >
                      {/* Book Image */}
                      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        <img 
                          src={book.image || bookImg} 
                          alt={book.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Availability Badge */}
                        <div className="absolute top-4 right-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                            book.amount > 0 
                              ? 'bg-green-500/90 text-white' 
                              : 'bg-red-500/90 text-white'
                          }`}>
                            {book.amount > 0 ? `${book.amount} tersedia` : 'Habis'}
                          </span>
                        </div>
                      </div>

                      {/* Book Info */}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {book.title}
                        </h3>
                        
                        {book.authors?.length > 0 && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-1">
                            {book.authors.map(a => a.name).join(', ')}
                          </p>
                        )}
                        
                        {/* Categories */}
                        {book.categories?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {book.categories.slice(0, 2).map(cat => (
                              <span 
                                key={cat.name} 
                                className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium"
                              >
                                {cat.name}
                              </span>
                            ))}
                            {book.categories.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                                +{book.categories.length - 2}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            className="flex-1 btn btn-outline border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 rounded-xl"
                            onClick={() => navigate(`/user/book/${book.id}`)}
                          >
                            <EyeIcon className="h-4 w-4" />
                            Detail
                          </button>
                          
                          <button
                            className={`flex-1 btn rounded-xl transition-all duration-200 ${
                              book.amount > 0 
                                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl' 
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed border-0'
                            }`}
                            onClick={() => handlePinjamBuku(book)}
                            disabled={book.amount <= 0 || borrowing === book.id}
                          >
                            {borrowing === book.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></div>
                                Meminjam...
                              </>
                            ) : book.amount > 0 ? (
                              'Pinjam Sekarang'
                            ) : (
                              'Tidak Tersedia'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
                    <button
                      className="btn btn-sm btn-outline border-red-200 text-red-700 rounded"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    {/* Smart Pagination: show first, last, current, neighbors, and ellipsis */}
                    {(() => {
                      const pageButtons = [];
                      const pageRange = 2; // show 2 before/after current
                      let start = Math.max(2, currentPage - pageRange);
                      let end = Math.min(totalPages - 1, currentPage + pageRange);
                      // Always show first page
                      pageButtons.push(
                        <button
                          key={1}
                          className={`btn btn-sm rounded font-bold ${currentPage === 1 ? 'bg-red-600 text-white' : 'bg-white text-red-700 border-red-200'}`}
                          onClick={() => setCurrentPage(1)}
                        >
                          1
                        </button>
                      );
                      // Ellipsis before
                      if (start > 2) {
                        pageButtons.push(<span key="start-ellipsis" className="px-2 text-gray-400">...</span>);
                      }
                      // Middle pages
                      for (let i = start; i <= end; i++) {
                        pageButtons.push(
                          <button
                            key={i}
                            className={`btn btn-sm rounded font-bold ${currentPage === i ? 'bg-red-600 text-white' : 'bg-white text-red-700 border-red-200'}`}
                            onClick={() => setCurrentPage(i)}
                          >
                            {i}
                          </button>
                        );
                      }
                      // Ellipsis after
                      if (end < totalPages - 1) {
                        pageButtons.push(<span key="end-ellipsis" className="px-2 text-gray-400">...</span>);
                      }
                      // Always show last page if more than 1
                      if (totalPages > 1) {
                        pageButtons.push(
                          <button
                            key={totalPages}
                            className={`btn btn-sm rounded font-bold ${currentPage === totalPages ? 'bg-red-600 text-white' : 'bg-white text-red-700 border-red-200'}`}
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </button>
                        );
                      }
                      return pageButtons;
                    })()}
                    <button
                      className="btn btn-sm btn-outline border-red-200 text-red-700 rounded"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default BorrowBook