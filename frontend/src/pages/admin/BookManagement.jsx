import React, { useState, useEffect, useRef } from 'react'
import { PlusIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import NavbarAdmin from '../../components/NavbarAdmin'
import { booksAPI } from '../../services/api'

function BookManagement() {
  const [books, setBooks] = useState([])
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
  const [filter, setFilter] = useState('')
  const [filterCol, setFilterCol] = useState('all')
  const [showFilterOpt, setShowFilterOpt] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  
  // Image cropping states
  const [imagePreview, setImagePreview] = useState(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState()
  const [showCropModal, setShowCropModal] = useState(false)
  const imgRef = useRef(null)
  const previewCanvasRef = useRef(null)
  
  const pageSize = 5

  useEffect(() => {
    fetchBooks()
  }, [])

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

  // Filter logic
  const filteredBooks = books.filter(b => {
    const q = filter.toLowerCase()
    if (!q) return true
    if (filterCol === 'all') {
      return (
        b.title.toLowerCase().includes(q) ||
        (b.authors && b.authors.map(a => a.name).join(', ').toLowerCase().includes(q)) ||
        String(b.amount).includes(q) ||
        (b.publisher && b.publisher.toLowerCase().includes(q))
      )
    }
    if (filterCol === 'title') return b.title.toLowerCase().includes(q)
    if (filterCol === 'author') return b.authors && b.authors.map(a => a.name).join(', ').toLowerCase().includes(q)
    if (filterCol === 'amount') return String(b.amount).includes(q)
    if (filterCol === 'publisher') return b.publisher && b.publisher.toLowerCase().includes(q)
    return true
  })
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / pageSize))
  const paginatedBooks = filteredBooks.slice((page - 1) * pageSize, page * pageSize)
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
    }
    setImagePreview(null)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editMode) {
        await booksAPI.updateBook(form.id, form)
        alert('Buku berhasil diupdate!')
      } else {
        await booksAPI.createBook(form)
        alert('Buku berhasil ditambahkan!')
      }
      handleCloseForm()
      await fetchBooks() // Refresh data
    } catch (err) {
      alert(`Error: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus buku ini?')) {
      try {
        await booksAPI.deleteBook(id)
        alert('Buku berhasil dihapus!')
        await fetchBooks() // Refresh data
      } catch (err) {
        alert(`Error: ${err.message}`)
      }
    }
  }
  
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <NavbarAdmin />
      <div className="max-w-6xl mx-auto px-4 py-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-extrabold text-red-800 tracking-tight drop-shadow-sm">Kelola Buku</h1>
          <button
            className="flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 transition px-4 py-2 rounded-lg font-semibold shadow-sm border border-red-200 text-sm"
            onClick={() => handleOpenForm()}
          >
            <PlusIcon className="h-4 w-4" /> Tambah Buku
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 relative">
          <div className="flex w-full sm:w-auto gap-2 items-center">
            <input
              type="text"
              placeholder={
                filterCol === 'all' ? 'Cari judul, penulis, stok, penerbit...' :
                filterCol === 'title' ? 'Cari judul...' :
                filterCol === 'author' ? 'Cari penulis...' :
                filterCol === 'amount' ? 'Cari stok...' :
                'Cari penerbit...'
              }
              value={filter}
              onChange={e => { setFilter(e.target.value); setPage(1); }}
              className="w-full sm:w-72 border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300 shadow-sm"
            />
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 bg-white text-red-700 font-semibold hover:bg-red-100 transition shadow-sm text-sm"
                onClick={() => setShowFilterOpt(v => !v)}
                aria-label="Filter Kolom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-2-1A1 1 0 009 18v-4.586a1 1 0 00-.293-.707L2.293 6.707A1 1 0 012 6V4z" /></svg>
                <span className="hidden sm:inline">Filter</span>
              </button>
              {showFilterOpt && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-red-100 rounded-lg shadow-lg z-10">
                  <ul className="py-1 text-sm text-gray-700">
                    <li><button className={`w-full text-left px-4 py-2 hover:bg-red-50 ${filterCol==='all'?'font-bold text-red-700':''}`} onClick={() => {setFilterCol('all');setShowFilterOpt(false)}}>Semua Kolom</button></li>
                    <li><button className={`w-full text-left px-4 py-2 hover:bg-red-50 ${filterCol==='title'?'font-bold text-red-700':''}`} onClick={() => {setFilterCol('title');setShowFilterOpt(false)}}>Judul</button></li>
                    <li><button className={`w-full text-left px-4 py-2 hover:bg-red-50 ${filterCol==='author'?'font-bold text-red-700':''}`} onClick={() => {setFilterCol('author');setShowFilterOpt(false)}}>Penulis</button></li>
                    <li><button className={`w-full text-left px-4 py-2 hover:bg-red-50 ${filterCol==='amount'?'font-bold text-red-700':''}`} onClick={() => {setFilterCol('amount');setShowFilterOpt(false)}}>Stok</button></li>
                    <li><button className={`w-full text-left px-4 py-2 hover:bg-red-50 ${filterCol==='publisher'?'font-bold text-red-700':''}`} onClick={() => {setFilterCol('publisher');setShowFilterOpt(false)}}>Penerbit</button></li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Memuat data buku...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : (          <>
            <div className="rounded-lg shadow border border-red-100 bg-white overflow-x-auto">
              <table className="min-w-full text-sm" style={{ minWidth: '1000px' }}>                <thead>
                  <tr className="bg-red-50 border-b border-red-100">
                    <th className="px-6 py-3 text-left font-bold text-red-700 uppercase tracking-wider text-xs">Judul</th>
                    <th className="px-6 py-3 text-left font-bold text-red-700 uppercase tracking-wider text-xs">Penulis</th>
                    <th className="px-6 py-3 text-left font-bold text-red-700 uppercase tracking-wider text-xs">Penerbit</th>
                    <th className="px-6 py-3 text-left font-bold text-red-700 uppercase tracking-wider text-xs">Tanggal Terbit</th>
                    <th className="px-6 py-3 text-left font-bold text-red-700 uppercase tracking-wider text-xs">Stok</th>
                    <th className="px-6 py-3 text-center font-bold text-red-700 uppercase tracking-wider text-xs">Aksi</th>
                  </tr>
                </thead>
                <tbody>                  {paginatedBooks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">Tidak ada data yang cocok.</td>
                    </tr>
                  )}
                  {paginatedBooks.map((book, idx) => (
                    <tr key={book.id} className={`${(idx % 2 === 0 ? 'bg-white' : 'bg-red-50')} border-b border-red-50 hover:bg-red-100/60 transition`}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{book.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {book.authors?.length > 0 ? book.authors.map(a => a.name).join(', ') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{book.publisher || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{book.published_date || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{book.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            className="flex items-center gap-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200 rounded-lg px-2 py-1 text-xs font-semibold transition shadow-sm"
                            onClick={() => handleOpenForm(book)}
                          >
                            <PencilSquareIcon className="h-3 w-3" /> Edit
                          </button>
                          <button
                            className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 rounded-lg px-2 py-1 text-xs font-semibold transition shadow-sm"
                            onClick={() => handleDelete(book.id)}
                          >
                            <TrashIcon className="h-3 w-3" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
              <span className="text-gray-500 text-sm">
                Halaman {page} dari {totalPages} | Total: {filteredBooks.length} buku
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded-lg border border-red-200 bg-white text-red-700 font-semibold hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >Sebelumnya</button>
                <button
                  className="px-3 py-1 rounded-lg border border-red-200 bg-white text-red-700 font-semibold hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >Berikutnya</button>
              </div>
            </div>
          </>
        )}        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 transition-all">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-red-100 w-full max-w-5xl max-h-[90vh] overflow-y-auto p-0 animate-fadeIn" 
                 style={{aspectRatio: '3/2'}}>
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors text-2xl p-1 rounded-full focus:outline-none z-10"
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
          </div>        )}

        {/* Modal Crop */}
        {showCropModal && imagePreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-all">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-red-100 w-full max-w-lg p-0 animate-fadeIn">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-colors text-2xl p-1 rounded-full focus:outline-none z-10"
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
