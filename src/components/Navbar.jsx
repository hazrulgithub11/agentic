import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo/Home */}
            <Link 
              to="/" 
              className="flex items-center px-2 py-2 text-purple-300 font-bold text-lg"
            >
              Pokémon NFT
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex md:items-center md:ml-6">
              <Link
                to="/scan"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/scan')
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Scan Card
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center">
            <Link
              to="/admin"
              className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${
                isActive('/admin')
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-300 hover:bg-purple-600 hover:text-white'
              }`}
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/scan"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/scan')
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Scan Card
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 