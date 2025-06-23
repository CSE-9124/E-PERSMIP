import React from 'react'
import NavbarAdmin from '../../components/NavbarAdmin'

const stats = [
  { label: 'Total Buku', value: 120, color: 'bg-red-100 text-red-700 border-red-200' },
  { label: 'Total User', value: 45, color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { label: 'Total Peminjaman', value: 230, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
]

const mockChart = [
  { month: 'Jan', value: 10 },
  { month: 'Feb', value: 18 },
  { month: 'Mar', value: 25 },
  { month: 'Apr', value: 20 },
  { month: 'Mei', value: 30 },
  { month: 'Jun', value: 22 },
  { month: 'Jul', value: 28 },
  { month: 'Agu', value: 24 },
  { month: 'Sep', value: 19 },
  { month: 'Okt', value: 27 },
  { month: 'Nov', value: 21 },
  { month: 'Des', value: 15 },
]

function Statistics() {
  const maxVal = Math.max(...mockChart.map(d => d.value))
  return (
    <div className="min-h-screen bg-white">
      <NavbarAdmin />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold text-red-800 tracking-tight drop-shadow-sm mb-8">Statistik Peminjaman</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-lg border shadow-sm p-6 flex flex-col items-center ${s.color}`}>
              <div className="text-3xl font-extrabold mb-1">{s.value}</div>
              <div className="text-base font-semibold opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow border border-red-100 p-6">
          <h2 className="text-xl font-bold text-red-700 mb-6">Grafik Peminjaman per Bulan</h2>
          <div className="flex items-end gap-2 h-48 w-full overflow-x-auto">
            {mockChart.map((d, i) => (
              <div key={d.month} className="flex flex-col items-center w-8">
                <div
                  className="w-full rounded-t-lg bg-red-400 transition-all"
                  style={{ height: `${(d.value / maxVal) * 140 + 10}px` }}
                  title={d.value}
                ></div>
                <span className="text-xs mt-2 text-gray-500">{d.month}</span>
                <span className="text-xs text-gray-700 font-semibold">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
