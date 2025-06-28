import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../../components/NavbarAdmin';
import { borrowsAPI } from '../../services/api';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { showNotification } from '../../utils/notification';

function BorrowManagement({ onLogout }) {
  const [borrows, setBorrows] = useState([]);
  const [filteredBorrows, setFilteredBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ open: false, borrow: null, status: '', date: '' });
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 peminjaman per halaman
  useEffect(() => {
    fetchBorrows();
  }, []);

  // Filter dan search effect
  useEffect(() => {
    let filtered = borrows;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (borrow) =>
          borrow.borrower?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          borrow.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          borrow.id.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'semua') {
      filtered = filtered.filter((borrow) => borrow.status === statusFilter);
    }

    setFilteredBorrows(filtered);
    setCurrentPage(1); // Reset ke halaman pertama saat filter berubah
  }, [borrows, searchTerm, statusFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredBorrows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBorrows = filteredBorrows.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const data = await borrowsAPI.getAllBorrows();
      setBorrows(data);
    } catch (error) {
      showNotification('Gagal memuat data peminjaman', 'error');
    } finally {
      setLoading(false);
    }
  };


  // Modal edit
  const openEditModal = (borrow) => {
    setEditModal({
      open: true,
      borrow,
      status: borrow.status,
      date: borrow.return_date ? borrow.return_date.slice(0, 10) : new Date().toISOString().slice(0, 10),
    });
  };
  const closeEditModal = () => {
    setEditModal({ open: false, borrow: null, status: '', date: '' });
  };
  const handleEditChange = (e) => {
    setEditModal((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await borrowsAPI.updateBorrowByAdmin(editModal.borrow.id, {
        status: editModal.status,
        return_date: editModal.date,
      });
      showNotification('Data peminjaman berhasil diupdate', 'success');
      closeEditModal();
      fetchBorrows();
    } catch {
      showNotification('Gagal update data peminjaman', 'error');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <NavbarAdmin onLogout={onLogout} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-800 mb-2">Kelola Peminjaman Buku</h1>
          <p className="text-gray-600">Kelola dan pantau semua peminjaman buku perpustakaan</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama peminjam, judul buku, atau ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>
            
            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all bg-white"
              >
                <option value="semua">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="dipinjam">Dipinjam</option>
                <option value="dikembalikan">Dikembalikan</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {currentBorrows.length > 0 ? startIndex + 1 : 0} - {Math.min(endIndex, filteredBorrows.length)} dari {filteredBorrows.length} peminjaman
          </div>
        </div>        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Memuat data peminjaman...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
            <div className="overflow-x-auto">              <table className="min-w-full">
                <thead className="bg-red-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Peminjam</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Buku</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Tanggal Pinjam</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Tanggal Kembali</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentBorrows.map((b, index) => (
                    <tr key={b.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{b.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{b.borrower?.full_name || '-'}</div>
                        <div className="text-sm text-gray-500">{b.borrower?.email || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{b.book?.title || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {b.borrow_date ? new Date(b.borrow_date).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {b.return_date ? new Date(b.return_date).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {b.status === 'menunggu' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></div>
                            Menunggu
                          </span>
                        )}
                        {b.status === 'dipinjam' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <ArrowPathIcon className="h-4 w-4 mr-2" />
                            Dipinjam
                          </span>
                        )}
                        {b.status === 'dikembalikan' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Dikembalikan
                          </span>
                        )}
                        {b.status === 'ditolak' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            Ditolak
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => openEditModal(b)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredBorrows.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Menampilkan {startIndex + 1} - {Math.min(endIndex, filteredBorrows.length)} dari {filteredBorrows.length} peminjaman
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
            
            {filteredBorrows.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">📚</div>
                <p className="text-gray-500">Tidak ada data peminjaman yang ditemukan</p>
              </div>
            )}
          </div>
        )}        
        {/* Modal Edit */}
        {editModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 transition-all">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-red-100 w-full max-w-md p-0 animate-fadeIn">
              <button 
                onClick={closeEditModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors text-2xl px-2 pt-0 pb-[2.6px] rounded-full focus:outline-none focus:ring-2 focus:ring-red-200 bg-transparent hover:bg-red-50 hover:ring-1 hover:ring-red-200 hover:border-red-200 focus:bg-red-50 active:bg-red-50" 
                aria-label="Tutup"
              >
                ×
              </button>
              <div className="px-8 pt-8 pb-6">
                <h2 className="text-2xl font-extrabold mb-6 text-red-700 text-center tracking-tight">Edit Status Peminjaman</h2>
                <form onSubmit={handleEditSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Peminjam: <span className="font-normal text-gray-600">{editModal.borrow?.borrower?.full_name}</span>
                    </label>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Buku: <span className="font-normal text-gray-600">{editModal.borrow?.book?.title}</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Status Peminjaman</label>
                    <select 
                      name="status" 
                      value={editModal.status} 
                      onChange={handleEditChange} 
                      className="w-full border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white"
                    >
                      <option value="menunggu">Menunggu</option>
                      <option value="dipinjam">Dipinjam</option>
                      <option value="dikembalikan">Dikembalikan</option>
                      <option value="ditolak">Ditolak</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700">Tanggal Kembali</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={editModal.date} 
                      onChange={handleEditChange} 
                      className="w-full border border-red-100 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-300 focus:border-red-400 transition text-gray-800 bg-white placeholder-gray-300" 
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <button 
                      type="button" 
                      onClick={closeEditModal} 
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 font-semibold transition"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold shadow-sm border border-red-600 transition"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BorrowManagement;
