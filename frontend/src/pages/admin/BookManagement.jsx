import React, { useState, useEffect, useRef } from 'react'
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import NavbarAdmin from '../../components/NavbarAdmin'
import { booksAPI } from '../../services/api'
import { categoriesAPI } from '../../services/api'
import { showNotification } from '../../utils/notification'

function BookManagement({ onLogout }) {
  const navigate = useNavigate()
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ 
    id: null, 
    title: '', 
    description: '', 
    amount: '', 
    publisher: '',
    published_date: '',
    image: null
  })
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState('semua')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // 10 buku per halaman
  
  // Image cropping states
  const [imagePreview, setImagePreview] = useState(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [showCropModal, setShowCropModal] = useState(false)
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)

  // New states for categories and authors
  const [categories, setCategories] = useState([])
  const [authors, setAuthors] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [authorInput, setAuthorInput] = useState('')
  const [authorList, setAuthorList] = useState([])

  useEffect(() => {
    fetchBooks()
    fetchCategories()
  }, [])

  // Filter dan search effect
  useEffect(() => {
    let filtered = books

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.publisher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.authors && book.authors.some(author => 
            author.name?.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      )
    }

    // Filter by stock
    if (stockFilter !== 'semua') {
      if (stockFilter === 'tersedia') {
        filtered = filtered.filter((book) => book.amount > 0)
      } else if (stockFilter === 'habis') {
        filtered = filtered.filter((book) => book.amount === 0)
      }
    }

    setFilteredBooks(filtered)
    setCurrentPage(1) // Reset ke halaman pertama saat filter berubah
  }, [books, searchTerm, stockFilter])

  // Calculate pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBooks = filteredBooks.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const fetchBooks = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await booksAPI.getAllBooks()
      setBooks(data)
    } catch (err) {
      setError('Gagal memuat data buku')
      showNotification('Gagal memuat data buku: ' + err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await categoriesAPI.getAllCategories()
      setCategories(data)
    } catch (err) {
      showNotification('Gagal memuat kategori', 'error')
    }
  }

  const handleOpenForm = (book = null) => {
    if (book) {
      setForm({
        id: book.id,
        title: book.title,
        description: book.description || '',
        amount: book.amount,
        publisher: book.publisher || '',
        published_date: book.published_date || '',
        image: null
      })
      setEditMode(true)
      setAuthorList(book.authors ? book.authors.map(a => a.name) : [])
      setSelectedCategory(book.categories && book.categories.length > 0 ? book.categories[0].name : '')
      setImagePreview(book.image || null)
    } else {
      setForm({ 
        id: null, 
        title: '', 
        description: '', 
        amount: '', 
        publisher: '',
        published_date: '',
        image: null
      })
      setEditMode(false)
      setAuthorList([])
      setSelectedCategory('')
      setImagePreview(null)
    }
    setShowCropModal(false)
    setCrop(undefined)
    setCompletedCrop(undefined)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setForm({ 
      id: null, 
      title: '', 
      description: '', 
      amount: '', 
      publisher: '',
      published_date: '',
      image: null
    })
    setEditMode(false)
    setImagePreview(null)
    setShowCropModal(false)
    setCrop(undefined)
    setCompletedCrop(undefined)
  }

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setImagePreview(event.target.result)
          setShowCropModal(true)
          // Initialize crop
          const crop = centerCrop(
            makeAspectCrop(
              {
                unit: '%',
                width: 90,
              },
              3 / 4, // aspect ratio
              300, // width
              400  // height
            ),
            300,
            400
          )
          setCrop(crop)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value })
    }
  }

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        3 / 4,
        width,
        height
      ),
      width,
      height
    )
    setCrop(crop)
  }

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!crop || !ctx) {
      return null
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    
    canvas.width = crop.width
    canvas.height = crop.height
    
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg', 0.8)
    })
  }

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop)
      if (croppedImageBlob) {
        const croppedFile = new File([croppedImageBlob], 'cropped-image.jpg', {
          type: 'image/jpeg'
        })
        setForm({ ...form, image: croppedFile })
        setShowCropModal(false)
      }
    }
  }

  const handleCropCancel = () => {
    setShowCropModal(false)
    setImagePreview(null)
    setCrop(undefined)
    setCompletedCrop(undefined)
  }

  const handleAuthorInput = (e) => {
    setAuthorInput(e.target.value)
  }

  const handleAuthorKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && authorInput.trim()) {
      e.preventDefault()
      if (!authorList.includes(authorInput.trim())) {
        setAuthorList([...authorList, authorInput.trim()])
      }
      setAuthorInput('')
    } else if (e.key === 'Backspace' && !authorInput && authorList.length > 0) {
      setAuthorList(authorList.slice(0, -1))
    }
  }

  const removeAuthor = (name) => {
    setAuthorList(authorList.filter(a => a !== name))
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const bookData = {
        ...form,
        authors: authorList,
        categories: selectedCategory ? [selectedCategory] : []
      }
      if (editMode) {
        await booksAPI.updateBook(form.id, bookData)
        showNotification('Buku berhasil diupdate!')
      } else {
        await booksAPI.createBook(bookData)
        showNotification('Buku berhasil ditambahkan!')
      }
      handleCloseForm()
      await fetchBooks() // Refresh data
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus buku ini?')) {
      try {
        await booksAPI.deleteBook(id)
        showNotification('Buku berhasil dihapus!')
        await fetchBooks() // Refresh data
      } catch (err) {
        showNotification(`Error: ${err.message}`, 'error')
      }
    }
  }  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <NavbarAdmin onLogout={onLogout} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-800 mb-2">Kelola Buku</h1>
          <p className="text-gray-600">Kelola dan pantau semua koleksi buku perpustakaan</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan judul, penulis, atau penerbit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>
            
            {/* Stock Filter */}
            <div className="md:w-48">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
              >
                <option value="semua">Semua Stok</option>
                <option value="tersedia">Tersedia</option>
                <option value="habis">Habis</option>
              </select>
            </div>

            {/* Add Book Button */}
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
              onClick={() => handleOpenForm()}
            >
              <PlusIcon className="h-5 w-5" />
              Tambah Buku
            </button>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredBooks.length} dari {books.length} buku
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Memuat data buku...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
            <div className="overflow-x-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <table className="min-w-full" style={{minWidth: '800px'}}>
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Gambar</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Judul</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Penulis</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Penerbit</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Stok</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentBooks.map((book, index) => (
                    <tr key={book.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-16 w-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {book.image ? (
                            <img src={book.image} alt={book.title} className="h-full w-full object-cover" />
                          ) : book.image_blob ? (
                            <img src={URL.createObjectURL(book.image_blob)} alt={book.title} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs">No img</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{book.title}</div>
                        <div className="text-sm text-gray-500">ID: {book.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {book.authors?.map(author => author.name).join(', ') || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{book.publisher || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          book.amount > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.amount} buku
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">                          <button 
                            onClick={() => navigate(`/admin/book/${book.id}`)} 
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-1"
                          >
                            <EyeIcon className="h-4 w-4" />
                            Detail
                          </button>
                          <button 
                            onClick={() => handleOpenForm(book)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-1"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(book.id)} 
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-1"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredBooks.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredBooks.length)} dari {filteredBooks.length} buku
                </div>
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Sebelumnya
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {(() => {
                      const pageButtons = []
                      const maxVisiblePages = 3
                      
                      // Always show first page
                      if (totalPages > 0) {
                        pageButtons.push(
                          <button
                            key={1}
                            onClick={() => handlePageChange(1)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === 1
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            1
                          </button>
                        )
                      }
                      
                      // Show middle pages around current page
                      let startPage = Math.max(2, currentPage - 1)
                      let endPage = Math.min(totalPages - 1, currentPage + 1)
                      
                      // Show dots before middle section if needed
                      if (startPage > 2) {
                        pageButtons.push(
                          <span key="dots-start" className="px-2 py-2 text-gray-500">
                            ...
                          </span>
                        )
                      }
                      
                      // Show middle pages
                      for (let i = startPage; i <= endPage; i++) {
                        if (i !== 1 && i !== totalPages) {
                          pageButtons.push(
                            <button
                              key={i}
                              onClick={() => handlePageChange(i)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === i
                                  ? 'bg-red-600 text-white'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {i}
                            </button>
                          )
                        }
                      }
                      
                      // Show dots after middle section if needed
                      if (endPage < totalPages - 1) {
                        pageButtons.push(
                          <span key="dots-end" className="px-2 py-2 text-gray-500">
                            ...
                          </span>
                        )
                      }
                      
                      // Always show last page if more than 1 page
                      if (totalPages > 1) {
                        pageButtons.push(
                          <button
                            key={totalPages}
                            onClick={() => handlePageChange(totalPages)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === totalPages
                                ? 'bg-red-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {totalPages}
                          </button>
                        )
                      }
                      
                      return pageButtons
                    })()}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
            
            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">📚</div>
                <p className="text-gray-500">Tidak ada data buku yang ditemukan</p>
              </div>
            )}
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 transition-all">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-red-100 w-full max-w-5xl max-h-[90vh] overflow-y-auto p-0 animate-fadeIn" 
                style={{aspectRatio: '3/2'}}>
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors text-2xl px-2 pt-0 pb-[2.6px] rounded-full focus:outline-none focus:ring-2 focus:ring-red-200 bg-transparent hover:bg-red-50 hover:ring-1 hover:ring-red-200 hover:border-red-200 focus:bg-red-50 active:bg-red-50 z-10"
                onClick={handleCloseForm}
              >
                &times;
              </button>
              <div className="p-8 h-full">
                <h2 className="text-2xl font-extrabold mb-6 text-red-700 text-center">
                  {editMode ? 'Edit Buku' : 'Tambah Buku'}
                </h2>
                
                <div className="grid grid-cols-3 gap-8 h-full">
                  {/* Left Column (2/3) - Form Fields */}
                  <div className="col-span-2 flex flex-col">
                    <form onSubmit={handleSubmit} className="space-y-4 flex-1" id="book-form">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Judul Buku</label>
                          <input type="text" name="title" value={form.title} onChange={handleChange} required
                            className="w-full border border-red-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300" />
                        </div>
                        
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Deskripsi</label>
                          <textarea name="description" value={form.description} onChange={handleChange}
                            className="w-full border border-red-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300" 
                            rows="3" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Stok</label>
                          <input type="number" name="amount" value={form.amount} onChange={handleChange} required min="0"
                            className="w-full border border-red-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Penerbit</label>
                          <input type="text" name="publisher" value={form.publisher} onChange={handleChange}
                            className="w-full border border-red-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300" />
                        </div>
                        
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Tanggal Terbit</label>
                          <input type="date" name="published_date" value={form.published_date} onChange={handleChange}
                            className="w-full border border-red-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white" />
                        </div>

                        {/* Penulis */}
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Penulis</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {authorList.map((name, idx) => (
                              <span key={idx} className="bg-red-100 text-red-700 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                                {name}
                                <button type="button" className="p-1 text-red-500 hover:text-red-700" onClick={() => removeAuthor(name)}>&times;</button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={authorInput}
                            onChange={handleAuthorInput}
                            onKeyDown={handleAuthorKeyDown}
                            placeholder="Ketik nama penulis lalu Enter atau koma..."
                            className="w-full border border-red-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300"
                          />
                        </div>

                        {/* Kategori */}
                        <div className="col-span-2">
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Kategori</label>
                          <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full border border-red-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white"
                          >
                            <option value="">Pilih kategori</option>
                            {categories.map((cat) => (
                              <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </form>
                    
                    {/* Form Buttons - At bottom of left column */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-red-100 mt-6">
                      <button type="button"
                        className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-semibold transition"
                        onClick={handleCloseForm}
                      >Batal</button>
                      <button type="submit" form="book-form"
                        className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow-sm border border-red-600 transition"
                        disabled={submitting}
                      >{submitting ? 'Menyimpan...' : editMode ? 'Simpan Perubahan' : 'Tambah Buku'}</button>
                    </div>
                  </div>
                  
                  {/* Right Column (1/3) - Image Upload & Preview */}
                  <div className="col-span-1 space-y-4 flex flex-col">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-700">Gambar Buku</label>
                      <input type="file" name="image" onChange={handleChange} accept="image/*"
                        className="w-full border border-red-100 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                      {form.image ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <div className="w-full aspect-[3/4] border border-red-200 rounded-lg overflow-hidden bg-gray-50">
                            <img
                              src={URL.createObjectURL(form.image)}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ) : imagePreview ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <div className="w-full aspect-[3/4] border border-red-200 rounded-lg overflow-hidden bg-gray-50">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full aspect-[3/4] border-2 border-dashed border-red-200 rounded-lg bg-gray-50 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <svg className="mx-auto h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">Upload gambar</p>
                            <p className="text-xs text-gray-300">Rasio 3:4</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Crop */}
        {showCropModal && imagePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 transition-all">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-red-100 w-full max-w-lg p-0 animate-fadeIn">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors text-2xl px-2 pt-0 pb-[2.6px] rounded-full focus:outline-none focus:ring-2 focus:ring-red-200 bg-transparent hover:bg-red-50 hover:ring-1 hover:ring-red-200 hover:border-red-200 focus:bg-red-50 active:bg-red-50 z-10"
                onClick={handleCropCancel}
              >
                &times;
              </button>
              <div className="px-6 pt-8 pb-6">
                <h2 className="text-xl font-extrabold mb-4 text-red-700 text-center">
                  Crop Gambar Buku
                </h2>
                <div className="mb-4">
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={3 / 4}
                    minWidth={150}
                    minHeight={200}
                  >
                    <img
                      ref={imgRef}
                      alt="Crop me"
                      src={imagePreview}
                      onLoad={onImageLoad}
                      className="max-w-full max-h-96 object-contain"
                    />
                  </ReactCrop>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-semibold transition"
                    onClick={handleCropCancel}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow-sm border border-red-600 transition"
                    onClick={handleCropComplete}
                  >
                    Gunakan Gambar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookManagement