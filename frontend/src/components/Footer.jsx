import React from 'react'
import unhasLogo from '../assets/unhas-logo.png'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-red-700 via-red-600 to-pink-500 text-white relative overflow-hidden rounded-t-3xl">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-48 translate-y-48"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Logo dan Informasi Universitas */}
                    <div className="md:col-span-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <img
                                src={unhasLogo}
                                alt="Universitas Hasanuddin Logo"
                                className="h-16 w-16 object-contain bg-white rounded-2xl p-2 shadow-lg"
                            />
                            <div>
                                <h3 className="text-lg font-bold">UNIVERSITAS</h3>
                                <h3 className="text-lg font-bold">HASANUDDIN</h3>
                            </div>
                        </div>
                        <div className="text-sm text-gray-100 space-y-1">
                            <p>Jl. Perintis Kemerdekaan Km.10 Tamalanrea, Makassar</p>
                            <p>Sulawesi Selatan Indonesia</p>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex space-x-3 mt-4">
                            <a href="https://www.youtube.com/@fakultasmipaunhas1937" className="bg-red-800 p-2 rounded-lg hover:bg-red-900 transition-colors">
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/fmipa.uh/" className="bg-red-800 p-2 rounded-lg hover:bg-red-900 transition-colors">
                                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier"> 
                                        <path fill-rule="evenodd" d="M8,2 L16,2 C19.3137085,2 22,4.6862915 22,8 L22,16 C22,19.3137085 19.3137085,22 16,22 L8,22 C4.6862915,22 2,19.3137085 2,16 L2,8 C2,4.6862915 4.6862915,2 8,2 Z M8,4 C5.790861,4 4,5.790861 4,8 L4,16 C4,18.209139 5.790861,20 8,20 L16,20 C18.209139,20 20,18.209139 20,16 L20,8 C20,5.790861 18.209139,4 16,4 L8,4 Z M12,17 C9.23857625,17 7,14.7614237 7,12 C7,9.23857625 9.23857625,7 12,7 C14.7614237,7 17,9.23857625 17,12 C17,14.7614237 14.7614237,17 12,17 Z M12,15 C13.6568542,15 15,13.6568542 15,12 C15,10.3431458 13.6568542,9 12,9 C10.3431458,9 9,10.3431458 9,12 C9,13.6568542 10.3431458,15 12,15 Z M17,8 C16.4477153,8 16,7.55228475 16,7 C16,6.44771525 16.4477153,6 17,6 C17.5522847,6 18,6.44771525 18,7 C18,7.55228475 17.5522847,8 17,8 Z"></path>
                                    </g>
                                </svg>

                            </a>
                        </div>
                    </div>

                    {/* Layanan Publik */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-yellow-200">Layanan Publik</h3>
                        <ul className="space-y-2 text-sm text-gray-100">
                            <li><a href="https://www.unhas.ac.id/keadilan-dan-anti-diskriminasi/?lang=id" className="text-gray-100 hover:text-yellow-200 transition-colors">Keadilan dan Anti Diskriminasi</a></li>
                            <li><a href="https://gol.kpk.go.id/login" className="text-gray-100 hover:text-yellow-200 transition-colors">Pengendalian Gratifikasi</a></li>
                            <li><a href="https://www.unhas.ac.id/layanan-terpadu/" className="text-gray-100 hover:text-yellow-200 transition-colors">Layanan Terpadu</a></li>
                            <li><a href="https://ppid.unhas.ac.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">PPID</a></li>
                            <li><a href="https://hkl.unhas.ac.id/unhas-gelar-fgd-penyusunan-program-kerja-reformasi-birokrasi-dan-zona-integritas-2025/" className="text-gray-100 hover:text-yellow-200 transition-colors">Reformasi Birokrasi</a></li>
                            <li><a href="https://aduan.unhas.ac.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">Aduan Unhas</a></li>
                            <li><a href="#" className="text-gray-100 hover:text-yellow-200 transition-colors">Zona Integritas</a></li>
                            <li><a href="https://www.lapor.go.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">LAPOR</a></li>
                        </ul>
                    </div>

                    {/* Menu */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-yellow-200">Menu</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://www.unhas.ac.id/kalender-akademik/" className="text-gray-100 hover:text-yellow-200 transition-colors">Kalender Akademik</a></li>
                            <li><a href="https://www.unhas.ac.id/kemitraan-luar-negeri/?lang=id" className="text-gray-100 hover:text-yellow-200 transition-colors">Unit Pendukung</a></li>
                            <li><a href="https://www.unhas.ac.id/direktorat-kemitraan/?lang=id" className="text-gray-100 hover:text-yellow-200 transition-colors">Kemitraan</a></li>
                            <li><a href="https://akademik.unhas.ac.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">Akademik</a></li>
                            <li><a href="https://lp2m.unhas.ac.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">Riset dan Inovasi</a></li>
                            <li><a href="https://greencampus.unhas.ac.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">Green Campus</a></li>
                            <li><a href="https://www.unhas.ac.id/laporan-keuangan-audited/" className="text-gray-100 hover:text-yellow-200 transition-colors">Laporan Keuangan</a></li>
                            <li><a href="https://www.unhas.ac.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">Tentang Unhas</a></li>
                        </ul>
                    </div>

                    {/* Link Cepat */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 text-yellow-200">Link Cepat</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://library.unhas.ac.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">Perpustakaan</a></li>
                            <li><a href="https://sso.unhas.ac.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">APPS</a></li>
                            <li><a href="https://journal.unhas.ac.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">Jurnal</a></li>
                            <li><a href="http://repository.unhas.ac.id/" className="text-gray-100 hover:text-yellow-200 transition-colors">Repositori</a></li>
                            <li><a href="https://www.unhas.ac.id/penggunaan-videotron/" className="text-gray-100 hover:text-yellow-200 transition-colors">Publikasi Videotron</a></li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-red-800 mt-8 pt-6">
                    <div className="text-center text-sm text-gray-100">
                        <p>Copyright © 2025 Fakultas Matematika dan Ilmu Pengetahuan Alam Universitas Hasanuddin All rights reserved.</p>
                    </div>
                </div>

                {/* Scroll to Top Button */}
                {/* <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-6 right-6 bg-red-800 hover:bg-red-900 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
                    aria-label="Scroll to top"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button> */}
            </div>
        </footer>
    )
}

export default Footer