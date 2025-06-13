import { useState } from 'react'

const AuthToggle = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      console.log('Login:', { email: formData.email, password: formData.password })
      alert('Login berhasil! (Demo)')
    } else {
      console.log('Register:', formData)
      alert('Registrasi berhasil! (Demo)')
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: ''
    })
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    resetForm()
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen w-full transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-red-900 to-black' 
        : 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-100'
    }`}>
      {/* Theme Toggle Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          } shadow-lg`}
        >
          {isDarkMode ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Content Container */}
      <div className="flex items-center justify-center min-h-screen w-full px-4 py-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className={`mx-auto h-20 w-20 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-r from-red-600 to-pink-600'
                : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}>
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className={`mt-6 text-4xl font-extrabold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {isLogin ? 'Masuk ke E-PERSMIP' : 'Daftar E-PERSMIP'}
            </h1>
            <p className={`mt-3 text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {isLogin ? 'Sistem Elektronik Perizinan dan Pelaporan Simpang' : 'Buat akun baru untuk mengakses sistem'}
            </p>
          </div>

          {/* Mode Toggle Buttons */}
          <div className={`flex rounded-xl p-1 transition-all duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'
          }`}>
            <button
              onClick={() => !isLogin && toggleMode()}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isLogin
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => isLogin && toggleMode()}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 ${
                !isLogin
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Form Container */}
          <div className={`backdrop-blur-lg rounded-2xl shadow-2xl border transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/95 border-gray-200'
          }`}>
            <div className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="transform transition-all duration-300 ease-in-out">
                    <label htmlFor="fullName" className={`block text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Nama Lengkap
                    </label>
                    <div className="mt-2">
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        required={!isLogin}
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-offset-2 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-red-500 focus:border-red-500'
                        }`}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className={`block text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-offset-2 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-red-500 focus:border-red-500'
                      }`}
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className={`block text-sm font-medium transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-offset-2 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-red-500 focus:border-red-500'
                      }`}
                      placeholder={isLogin ? "Masukkan password" : "Buat password (min. 6 karakter)"}
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="transform transition-all duration-300 ease-in-out">
                    <label htmlFor="confirmPassword" className={`block text-sm font-medium transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Konfirmasi Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required={!isLogin}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-offset-2 ${
                          isDarkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-red-500 focus:border-red-500'
                        }`}
                        placeholder="Ulangi password"
                      />
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className={`ml-2 block text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-900'
                      }`}>
                        Ingat saya
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className={`font-medium transition-colors duration-300 ${
                        isDarkMode 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-red-600 hover:text-red-500'
                      }`}>
                        Lupa password?
                      </a>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    className={`group relative w-full flex justify-center py-4 px-6 border border-transparent text-sm font-bold rounded-lg text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-lg'
                        : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-xl'
                    }`}
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-4">
                      {isLogin ? (
                        <svg className="h-5 w-5 text-red-300 group-hover:text-red-200" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-300 group-hover:text-red-200" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                      )}
                    </span>
                    {isLogin ? 'Masuk' : 'Daftar Sekarang'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Dengan menggunakan layanan ini, Anda menyetujui{' '}
              <a href="#" className={`transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-red-600 hover:text-red-500'
              }`}>
                Syarat & Ketentuan
              </a>{' '}
              dan{' '}
              <a href="#" className={`transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-red-600 hover:text-red-500'
              }`}>
                Kebijakan Privasi
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthToggle
