import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useSelector((state) => state.StoreApp.totalItems);
  const favouritesCount = useSelector((state) => state.Favourites.items.length);
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const linkStyle = (path) =>
    `font-medium transition-colors ${
      isActive(path) ? "text-[#0067FF]" : "text-gray-700 hover:text-gray-900"
    }`;

  return (
    <>
      <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-2 md:gap-8">
          {/* Mobile Menu Button (Hamburger) - Only visible on mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Search Icon - Hidden on mobile */}
          <div className="hidden md:block cursor-pointer text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>

          {/* Left Nav Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className={linkStyle("/")}>
              Home
            </Link>
            <Link to="/collection" className={linkStyle("/collection")}>
              Collection
            </Link>
          </div>

          {/* Logo SVG */}
          <Link
            to="/"
            className="flex items-center justify-center flex-shrink-0"
          >
            <img src="a.png" className="h-10 md:h-12 w-auto" alt="Logo" />
          </Link>

          {/* Right Nav Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/about" className={linkStyle("/about")}>
              About us
            </Link>
            <Link to="/contact" className={linkStyle("/contact")}>
              Contact us
            </Link>
          </div>

          {/* Icons */}
          <div className="flex gap-2 md:gap-4 items-center flex-shrink-0">
            {/* Favourite - Hidden on mobile, shown on desktop */}
            <Link to="/favourite" className="relative hidden md:block">
              <button
                className={`p-2 transition-colors ${
                  isActive("/favourite")
                    ? "text-[#0067FF]"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isActive("/favourite") ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                {favouritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {favouritesCount > 99 ? "99+" : favouritesCount}
                  </span>
                )}
              </button>
            </Link>
            {/* Panier - Always visible */}
            <Link to="/panier" className="relative">
              <button
                className={`p-2 transition-colors ${
                  isActive("/panier")
                    ? "text-[#0067FF]"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>
            </Link>
            {/* Account - Hidden on mobile, shown on desktop */}
            <button className="hidden md:block p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Only visible on mobile screens */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-blue-600">Menu</h2>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-gray-100">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-6 py-4 text-lg font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/collection"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-6 py-4 text-lg font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Collection
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-6 py-4 text-lg font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              >
                About us
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-6 py-4 text-lg font-medium text-gray-800 hover:bg-gray-50 transition-colors"
              >
                Contact us
              </Link>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-gray-200 p-6 grid grid-cols-2 gap-4">
              <Link
                to="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Account
                </span>
              </Link>
              <Link
                to="/favourite"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Wishlist
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
