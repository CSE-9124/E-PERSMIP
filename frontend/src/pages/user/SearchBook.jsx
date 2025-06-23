import React, { useState } from 'react'
// Dummy data buku
const dummyBooks = [
  { id: 1, title: 'Algoritma dan Struktur Data', author: 'S. Simanjuntak' },
  { id: 2, title: 'Machine Learning', author: 'A. Widodo' },
  { id: 3, title: 'Matematika Diskrit', author: 'B. Santosa' },
]
function SearchBook() {
  const [search, setSearch] = useState('')
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-red-700">Cari Buku</h1>
      <input type="text" className="input input-bordered w-full mb-4" placeholder="Cari judul buku..." value={search} onChange={e => setSearch(e.target.value)} />
      <div className="max-h-80 overflow-y-auto divide-y">
        {dummyBooks.filter(b => b.title.toLowerCase().includes(search.toLowerCase())).map(book => (
          <div key={book.id} className="py-3">
            <div className="font-semibold text-gray-800">{book.title}</div>
            <div className="text-sm text-gray-500">{book.author}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default SearchBook
