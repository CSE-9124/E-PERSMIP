import { useState } from "react";
import { useNavigate } from "react-router-dom";
import unhasLogo from "../../assets/unhas-logo.png";
import bgUnhas from "../../assets/bg_unhas.png";

const autofillOverride = {
    backgroundColor: "#fff",
    color: "#111",
    WebkitBoxShadow: "0 0 0 1000px #fff inset",
    boxShadow: "0 0 0 1000px #fff inset",
    WebkitTextFillColor: "#111",
    borderColor: "#e5e7eb",
};

const Login = ({ onSwitchToRegister, onLogin, isLoading }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onLogin(formData);
            // Hapus/komentari redirect di sini, biar AuthWrapper yang handle
        } catch (err) {
            // Optional: tampilkan error jika ingin
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left: Form */}
            <div className="w-full lg:w-1/2 h-screen flex flex-col justify-center items-center bg-white py-8 px-4">
                <div className="w-full max-w-md">
                    {/* Logo Unhas */}
                    <div className="flex justify-center mb-8">
                        <img src={unhasLogo} alt="Universitas Hasanuddin" className="h-16" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Masuk</h2>
                    <p className="text-gray-600 mb-6 text-center">Silakan masuk ke akun Anda</p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="login-email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black placeholder-gray-400 text-base"
                                placeholder="Email"
                                autoComplete="email"
                                style={autofillOverride}
                            />
                        </div>
                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="login-password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-black placeholder-gray-400 text-base"
                                placeholder="Password"
                                autoComplete="current-password"
                                style={autofillOverride}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full border-2 border-red-300 text-red-400 bg-white font-bold py-3 rounded-xl mt-2 transition-all duration-200 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white hover:border-red-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Masuk...
                                </span>
                            ) : (
                                'Masuk'
                            )}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-600">
                        Belum punya akun?{" "}
                        <button
                            onClick={onSwitchToRegister}
                            className="font-semibold text-red-500 border border-red-200 bg-white hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white transition-all duration-200 px-3 py-1 rounded cursor-pointer focus:outline-none"
                        >
                            Daftar sekarang
                        </button>
                    </p>
                </div>
            </div>
            {/* Right: Branding */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-red-600 via-red-500 to-pink-400 text-white p-12 relative overflow-hidden">
                {/* Background Image */}
                <img src={bgUnhas} alt="Background Unhas" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none" />
                <div className="mb-8 relative z-10">
                    <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                </div>
                <h1 className="text-5xl font-bold mb-4 relative z-10">E-PERSMIP</h1>
                <p className="text-xl text-red-100 mb-8 text-center leading-relaxed relative z-10">
                    Sistem Elektronik Peminjaman<br />Perpustakaan MIPA<br />
                    <span className="text-red-200 font-semibold">Universitas Hasanuddin</span>
                </p>
                <ul className="space-y-3 text-lg relative z-10">
                    <li>• Akses mudah ke koleksi perpustakaan</li>
                    <li>• Peminjaman buku secara digital</li>
                    <li>• Riwayat peminjaman terintegrasi</li>
                </ul>
            </div>
        </div>
    );
}

export default Login;
