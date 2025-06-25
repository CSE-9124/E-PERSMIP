import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../../components/NavbarAdmin';
import { borrowsAPI } from '../../services/api';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

function BorrowManagement() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [editModal, setEditModal] = useState({ open: false, borrow: null, status: '', date: '' });

  useEffect(() => {
    fetchBorrows();
  }, []);

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const data = await borrowsAPI.getAllBorrows();
      setBorrows(data);
    } catch (error) {
      setNotification('Gagal memuat data peminjaman');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await borrowsAPI.approveBorrow(id);
      setNotification('Peminjaman disetujui');
      fetchBorrows();
    } catch {
      setNotification('Gagal menyetujui peminjaman');
    }
  };

  const handleDecline = async (id) => {
    try {
      await borrowsAPI.declineBorrow(id);
      setNotification('Peminjaman ditolak');
      fetchBorrows();
    } catch {
      setNotification('Gagal menolak peminjaman');
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
      setNotification('Data peminjaman berhasil diupdate');
      closeEditModal();
      fetchBorrows();
    } catch {
      setNotification('Gagal update data peminjaman');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarAdmin />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-red-800">Kelola Peminjaman Buku</h1>
        {notification && (
          <div className="mb-4 px-4 py-2 bg-green-100 border border-green-400 text-green-700 rounded">
            {notification}
          </div>
        )}
        {loading ? (
          <div className="text-center py-8">Memuat data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-red-50">
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">User</th>
                  <th className="p-2 border">Buku</th>
                  <th className="p-2 border">Tanggal Pinjam</th>
                  <th className="p-2 border">Tanggal Kembali</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {borrows.map((b) => (
                  <tr key={b.id} className="text-center">
                    <td className="border p-2">{b.id}</td>
                    <td className="border p-2">{b.borrower?.full_name || '-'}</td>
                    <td className="border p-2">{b.book?.title || '-'}</td>
                    <td className="border p-2">{b.borrow_date ? new Date(b.borrow_date).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="border p-2">{b.return_date ? new Date(b.return_date).toLocaleDateString('id-ID') : '-'}</td>
                    <td className="border p-2">
                      {b.status === 'menunggu' && <span className="text-yellow-600 font-semibold">Menunggu</span>}
                      {b.status === 'dipinjam' && <span className="text-green-600 font-semibold flex items-center justify-center gap-1"><ArrowPathIcon className="h-4 w-4" />Dipinjam</span>}
                      {b.status === 'dikembalikan' && <span className="text-purple-600 font-semibold flex items-center justify-center gap-1"><CheckCircleIcon className="h-4 w-4" />Dikembalikan</span>}
                      {b.status === 'ditolak' && <span className="text-red-600 font-semibold flex items-center justify-center gap-1"><XCircleIcon className="h-4 w-4" />Ditolak</span>}
                    </td>
                    <td className="border p-2">
                      {b.status === 'menunggu' && (
                        <>
                          <button onClick={() => handleApprove(b.id)} className="bg-green-600 text-white px-3 py-1 rounded mr-2 hover:bg-green-700">Approve</button>
                          <button onClick={() => handleDecline(b.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Decline</button>
                        </>
                      )}
                      {b.status === 'dipinjam' && (
                        <button onClick={() => openEditModal(b)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Edit</button>
                      )}
                      {(b.status === 'dikembalikan' || b.status === 'ditolak') && (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Modal Edit */}
        {editModal.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded shadow-lg p-6 w-80">
              <h2 className="text-lg font-bold mb-4">Edit Peminjaman</h2>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm mb-1">Status</label>
                  <select name="status" value={editModal.status} onChange={handleEditChange} className="border rounded px-2 py-1 w-full">
                    <option value="dipinjam">Dipinjam</option>
                    <option value="dikembalikan">Dikembalikan</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Tanggal Kembali</label>
                  <input type="date" name="date" value={editModal.date} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <button type="button" onClick={closeEditModal} className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400">Batal</button>
                  <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BorrowManagement;
