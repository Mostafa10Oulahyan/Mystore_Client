import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
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
    <nav className="w-full fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-8">
        {/* Search Icon */}
        <div className="cursor-pointer text-gray-700 hover:text-gray-900 transition-colors">
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
        <Link to="/" className="flex items-center justify-center">
          <img src="a.png" className="h-12 w-auto" alt="Logo" />
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
        <div className="flex gap-4 items-center">
          <Link to="/favourite" className="relative">
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
          <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
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
  );
};

export default Navbar;
