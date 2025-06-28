import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import unhasLogo from "../assets/unhas-logo.png";

const navLinks = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/books", label: "Kelola Buku" },
  { to: "/admin/users", label: "Kelola User" },
  { to: "/admin/borrows", label: "Kelola Peminjaman" },
];

function NavbarAdmin({ onLogout }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-red-700 via-red-600 to-pink-500 shadow-xl rounded-b-3xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-5 md:py-7">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img
              src={unhasLogo}
              alt="Universitas Hasanuddin Logo"
              className="h-12 w-12 md:h-14 md:w-14 object-contain drop-shadow-lg bg-white rounded-2xl p-1"
            />
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-wide drop-shadow">
                E-PERSMIP
              </h1>
              <p className="text-sm md:text-base text-white opacity-90 font-medium">
                Universitas Hasanuddin
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-150 text-white/90 hover:bg-gray-200 hover:bg-opacity-20 hover:text-gray-200 ${location.pathname === link.to
                    ? "bg-red-900 bg-opacity-50 text-yellow-200 hover:text-white font-bold"
                    : "hover:bg-gray-200 hover:bg-opacity-20 hover:text-gray-200"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            <span className="text-yellow-200 font-semibold capitalize text-base md:text-lg bg-red-900 bg-opacity-30 px-3 py-1 rounded-xl">
              Admin
            </span>
            <button
              onClick={onLogout}
              className="bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white hover:border-white btn-sm shadow-md font-bold text-base px-4 py-0 rounded-xl transition-all duration-200"
            >
              Logout
            </button>
          </div>
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 rounded-lg bg-red-700/80 hover:bg-red-800 transition-colors border border-white/20"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="bg-white/10 rounded-2xl p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-semibold transition-all duration-150 text-white/90 hover:bg-gray-200 hover:bg-opacity-20 hover:text-gray-200 ${location.pathname === link.to
                      ? "bg-red-900 bg-opacity-50 text-yellow-200 hover:text-white font-bold"
                      : "hover:bg-gray-200 hover:bg-opacity-20 hover:text-gray-200"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-200 font-semibold text-sm bg-red-900 bg-opacity-30 px-3 py-1 rounded-xl">
                    Admin
                  </span>
                  <button
                    onClick={onLogout}
                    className="bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white font-bold px-4 py-2 rounded-xl transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavbarAdmin;
