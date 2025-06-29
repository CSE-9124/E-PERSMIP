import React, { useState, useEffect } from "react";
import NavbarUser from "../../components/NavbarUser";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { borrowsAPI, booksAPI, authAPI } from "../../services/api";

function HomeUser({ onLogout }) {
  const [notification, setNotification] = useState(null);
  const [recentBorrows, setRecentBorrows] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      // Debug: log user object to check status property
      // Remove this after confirming
      // eslint-disable-next-line no-console
      console.log("Current user object:", currentUser);
    }
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [borrowsData, booksData, userData] = await Promise.all([
        borrowsAPI.getMyBorrows(),
        booksAPI.getAllBooks(),
        authAPI.getCurrentUser(),
      ]);

      // Debug logging to understand data structure
      console.log("Borrows data:", borrowsData);
      console.log("Books data:", booksData);

      // Get recent borrows (last 3)
      setRecentBorrows(borrowsData.slice(0, 3));

      // Get recent books (first 3 from backend - already sorted by ID desc)
      setRecentBooks(booksData.slice(0, 3));

      // Set current user data
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk notifikasi
  const showNotification = (msg, duration = 3000) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), duration);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Tanggal tidak tersedia";
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Tanggal tidak valid";
      }
      
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Tanggal tidak valid";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      {/* Notifikasi */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 animate-fade-in">
          {notification}
        </div>
      )}
      <NavbarUser onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white/90 rounded-2xl p-8 mb-10 shadow-xl border border-red-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold mb-2 text-red-700 flex items-center gap-2">
              👋 Halo, {currentUser?.full_name || "Mahasiswa"}!
            </h2>
            <p className="text-lg text-gray-700 opacity-80">
              Selamat datang di{" "}
              <span className="font-bold text-red-600">E-PERSMIP</span> —
              layanan peminjaman buku digital Perpustakaan MIPA Unhas.
            </p>
            <p className="mt-2 text-base text-gray-500">
              Ayo cari, pinjam, dan kelola koleksi bukumu dengan mudah!
            </p>
            {/* Non-active user warning (now inside the card) */}
            {currentUser &&
              !currentUser.is_active && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-md mt-4 flex items-center gap-3">
                  <svg
                    className="h-6 w-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-semibold">
                    Akun Anda saat ini{" "}
                    <span className="underline">tidak aktif</span>. Anda tidak
                    dapat meminjam buku. Silakan hubungi admin untuk
                    mengaktifkan akun Anda.
                  </span>
                </div>
              )}
          </div>
          <div className="hidden md:block text-7xl">📚</div>
        </div>
        <div className="mb-10">
          <h3 className="text-xl font-bold mb-4 text-red-700 flex items-center gap-2">
            🚀 Akses Cepat
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-red-400">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">📚</div>
                <h2 className="card-title text-red-700 text-xl font-bold mb-1">
                  Pinjam Buku
                </h2>
                <p className="text-gray-600 opacity-80 mb-3">
                  Pilih dan pinjam buku favoritmu
                </p>
                <button
                  className="btn bg-red-600 text-white hover:bg-red-700 font-semibold px-6 py-2 rounded-xl shadow"
                  onClick={() => navigate("/user/borrow")}
                >
                  Pinjam
                </button>
              </div>
            </div>
            <div className="card bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 border-t-4 border-yellow-400">
              <div className="card-body items-center text-center">
                <div className="text-4xl mb-2">📋</div>
                <h2 className="card-title text-yellow-700 text-xl font-bold mb-1">
                  Riwayat Peminjaman
                </h2>
                <p className="text-gray-600 opacity-80 mb-3">
                  Lihat status & riwayat peminjamanmu
                </p>
                <button
                  className="btn bg-yellow-400 text-white hover:bg-yellow-500 font-semibold px-6 py-2 rounded-xl shadow"
                  onClick={() => navigate("/user/history")}
                >
                  Lihat
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white/90 rounded-2xl p-8 shadow-xl border border-red-100 mb-8">
          <h3 className="text-xl font-bold mb-6 text-red-700 flex items-center gap-2">
            <span className="text-2xl">🕒</span> Aktivitas Terbaru
          </h3>

          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Memuat aktivitas...</p>
            </div>
          ) : (
            <>
              {/* Recent Borrows */}
              {recentBorrows.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Peminjaman Terbaru
                  </h4>
                  <div className="space-y-3">
                    {recentBorrows.map((borrow) => (
                      <div
                        key={borrow.id}
                        className="flex items-center p-3 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-400 shadow-sm"
                      >
                        <span className="w-3 h-3 bg-blue-400 rounded-full mr-4"></span>
                        <div className="flex-1">
                          <span className="text-gray-700">
                            Buku{" "}
                            <b>
                              "{borrow.book?.title || "Judul Tidak Tersedia"}"
                            </b>
                            {" " + (borrow.status === "menunggu" ? "menunggu persetujuan" : String(borrow.status)) + "."}
                          </span>
                          <div className="text-sm text-gray-500 mt-1">
                            {(borrow.status === "dipinjam" || borrow.status === "dikembalikan") && (
                              <>
                                Tanggal Pinjam: {formatDate(borrow.borrow_date)}
                                {" "}
                                | Tanggal Kembali:{" "}
                                {borrow.status === "dikembalikan"
                                  ? formatDate(borrow.return_date)
                                  : "Belum dikembalikan"}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Books */}
              {recentBooks.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">
                    Buku Terbaru di Perpustakaan
                  </h4>
                  <div className="space-y-3">
                    {recentBooks.map((book) => (
                      <div
                        key={book.id}
                        className="flex items-center p-3 rounded-lg bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-400 shadow-sm"
                      >
                        <span className="w-3 h-3 bg-green-400 rounded-full mr-4"></span>
                        <div className="flex-1">
                          <span className="text-gray-700">
                            Buku baru <b>"{book.title}"</b> telah ditambahkan ke
                            koleksi
                          </span>
                          <div className="text-sm text-gray-500 mt-1">
                            Penulis:{" "}
                            {book.authors && book.authors.length > 0
                              ? book.authors.map((a) => a.name).join(", ")
                              : "-"}
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/user/book/${book.id}`)}
                          className="text-green-600 border-2 bg-green-100 hover:border-2 hover:border-green-400 font-semibold text-sm transition-all duration-200"
                        >
                          Lihat Detail
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Activity */}
              {recentBorrows.length === 0 && recentBooks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <span className="text-4xl block mb-2">📚</span>
                  Belum ada aktivitas. Mulai pinjam buku untuk melihat aktivitas
                  Anda!
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomeUser;
