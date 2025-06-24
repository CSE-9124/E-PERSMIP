import React, { useState } from 'react'
import NavbarUser from '../../components/NavbarUser'
import { BookOpenIcon, FunnelIcon } from '@heroicons/react/24/solid'
import bookImg from '../../assets/react.svg' // Ganti dengan gambar buku asli jika ada

// Dummy data buku
const dummyBooks = [
  { id: 1, title: 'Algoritma dan Struktur Data', author: 'S. Simanjuntak', available: true, category: 'Informatika', img: bookImg },
  { id: 2, title: 'Machine Learning', author: 'A. Widodo', available: false, category: 'Informatika', img: bookImg },
  { id: 3, title: 'Matematika Diskrit', author: 'B. Santosa', available: true, category: 'Matematika', img: bookImg },
  { id: 4, title: 'Statistika Dasar', author: 'C. Pratama', available: true, category: 'Statistika', img: bookImg },
  { id: 5, title: 'Fisika Modern', author: 'D. Siregar', available: false, category: 'Fisika', img: bookImg },
]

const categories = ['Semua', ...Array.from(new Set(dummyBooks.map(b => b.category)))]

function BorrowBook() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  const handlePinjamBuku = (book) => {
    if (!book.available) {
      alert('Buku tidak tersedia!')
      return
    }
    alert(`Berhasil meminjam: ${book.title}`)
  }

  // Filter buku berdasarkan search dan kategori
  const filteredBooks = dummyBooks.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory === 'Semua' || b.category === selectedCategory
    return matchSearch && matchCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <NavbarUser />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3 mb-2 md:mb-0">
            <span className="inline-flex items-center justify-center bg-red-100 rounded-xl p-2"><BookOpenIcon className="h-8 w-8 text-red-600" /></span>
            <div>
              <h1 className="text-3xl font-extrabold text-red-700 mb-1">Pinjam Buku</h1>
              <p className="text-gray-600">Cari dan pinjam buku favoritmu dari koleksi perpustakaan MIPA Unhas.</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              className="input input-bordered w-full md:w-72 border-red-200 focus:ring-2 focus:ring-red-400"
              placeholder="Cari judul buku..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-outline border-red-300 text-red-600 flex items-center gap-2"><FunnelIcon className="h-5 w-5" />Filter</button>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-44 mt-2 border border-red-100">
                {categories.map(cat => (
                  <li key={cat}>
                    <button className={`w-full text-left px-2 py-1 rounded ${selectedCategory === cat ? 'bg-red-100 text-red-700 font-bold' : ''}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredBooks.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12">Tidak ada buku ditemukan.</div>
          )}
          {filteredBooks.map(book => (
            <div key={book.id} className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-red-200 flex flex-col">
              <img src={book.img} alt={book.title} className="h-40 w-full object-contain p-4" />
              <div className="card-body flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="card-title text-lg font-bold text-red-700 mb-1">{book.title}</h2>
                  <p className="text-gray-500 text-sm mb-2">{book.author}</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 {book.available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-400'}">{book.available ? 'Tersedia' : 'Tidak Tersedia'}</span>
                  <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-600 ml-2">{book.category}</span>
                </div>
                <button
                  className={`btn mt-2 ${book.available ? 'btn-primary' : 'btn-disabled bg-gray-300 text-gray-400'}`}
                  onClick={() => handlePinjamBuku(book)}
                  disabled={!book.available}
                >
                  {book.available ? 'Pinjam Buku' : 'Tidak Tersedia'}
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Rekomendasi section */}
        {!search && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4 text-red-700 flex items-center gap-2"><BookOpenIcon className="h-6 w-6 text-red-600" /> Rekomendasi Buku</h3>
            <div className="flex gap-6 overflow-x-auto pb-2">
              {dummyBooks.slice(0, 5).map(book => (
                <div key={book.id} className="min-w-[220px] card bg-white shadow-md border-t-4 border-pink-200 flex flex-col">
                  <img src={book.img} alt={book.title} className="h-32 w-full object-contain p-3" />
                  <div className="card-body py-3 px-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-pink-700 text-base mb-1">{book.title}</div>
                      <div className="text-xs text-gray-500 mb-1">{book.author}</div>
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-600 mt-1">{book.category}</span>
                    </div>
                    <button
                      className={`btn btn-xs mt-2 ${book.available ? 'btn-primary' : 'btn-disabled bg-gray-300 text-gray-400'}`}
                      onClick={() => handlePinjamBuku(book)}
                      disabled={!book.available}
                    >
                      {book.available ? 'Pinjam' : 'Tidak Tersedia'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default BorrowBook
