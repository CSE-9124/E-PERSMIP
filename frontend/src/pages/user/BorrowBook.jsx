import React, { useState } from 'react'
// Dummy data buku
const dummyBooks = [
  { id: 1, title: 'Algoritma dan Struktur Data', author: 'S. Simanjuntak', available: true },
  { id: 2, title: 'Machine Learning', author: 'A. Widodo', available: false },
  { id: 3, title: 'Matematika Diskrit', author: 'B. Santosa', available: true },
]
function BorrowBook() {
  const [search, setSearch] = useState('')
  const handlePinjamBuku = (book) => {
    if (!book.available) {
      alert('Buku tidak tersedia!')
      return
    }
    alert(`Berhasil meminjam: ${book.title}`)
  }
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-red-700">Pinjam Buku</h1>
      <input type="text" className="input input-bordered w-full mb-4" placeholder="Cari judul buku..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="max-h-80 overflow-y-auto divide-y">
        {dummyBooks.filter(b => b.title.toLowerCase().includes(search.toLowerCase())).map(book => (
          <div key={book.id} className="flex justify-between items-center py-3">
            <div>
              <div className="font-semibold text-gray-800">{book.title}</div>
              <div className="text-sm text-gray-500">{book.author}</div>
            </div>
            <button className={`btn btn-sm ${book.available ? 'btn-primary' : 'btn-disabled bg-gray-300 text-gray-400'}`} onClick={() => handlePinjamBuku(book)} disabled={!book.available}>
              {book.available ? 'Pinjam' : 'Tidak Tersedia'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default BorrowBook
