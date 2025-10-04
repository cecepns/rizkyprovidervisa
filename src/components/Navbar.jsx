import { Link } from 'react-router-dom';
import { useState } from 'react';
import Logo from '../assets/logo.jpeg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              <img src={Logo} alt="Logo" className="w-14 h-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Beranda
            </Link>
            <Link to="/tentang" className="text-gray-700 hover:text-blue-600 transition">
              Tentang Kami
            </Link>
            <Link to="/kontak" className="text-gray-700 hover:text-blue-600 transition">
              Kontak
            </Link>
            <Link
              to="/admin/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Admin
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link
              to="/tentang"
              className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link
              to="/kontak"
              className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Kontak
            </Link>
            <Link
              to="/admin/login"
              className="block px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
