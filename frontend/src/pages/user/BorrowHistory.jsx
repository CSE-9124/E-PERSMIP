import React from 'react'
// Dummy data riwayat
const dummyHistory = [
  { id: 1, title: 'Algoritma dan Struktur Data', status: 'Dikembalikan', tanggal: '2025-06-10' },
  { id: 2, title: 'Machine Learning', status: 'Dipinjam', tanggal: '2025-06-20' },
]
function BorrowHistory() {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-red-700">Riwayat Peminjaman</h1>
      <div className="max-h-80 overflow-y-auto divide-y">
        {dummyHistory.map(item => (
          <div key={item.id} className="py-3 flex justify-between items-center">
            <div>
              <div className="font-semibold text-gray-800">{item.title}</div>
              <div className="text-sm text-gray-500">{item.tanggal}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Dipinjam' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
export default BorrowHistory
