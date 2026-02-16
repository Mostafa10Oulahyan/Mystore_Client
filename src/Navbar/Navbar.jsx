import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser, useClerk, SignInButton, UserButton } from "@clerk/clerk-react";
import { gsap } from "gsap";
import { EASE, DURATION } from "../animations/config";
import { useStore } from "../context/StoreContext";
import { useFavourites } from "../context/FavouritesContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileOverlayRef = useRef(null);
  const { totalItems } = useStore();
  const { items: favouriteItems } = useFavourites();
  const favouritesCount = favouriteItems.length;
  const { isSignedIn, user, isLoaded } = useUser();
  const location = useLocation();

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Smart Navbar - Hide on scroll down, show on scroll up
  useEffect(() => {
    if (!navRef.current) return;

    let lastScrollY = window.scrollY;
    let isHidden = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when at top
      if (currentScrollY < 100) {
        if (isHidden) {
          gsap.to(navRef.current, {
            y: 0,
            duration: DURATION.normal,
            ease: EASE.smooth,
          });
          isHidden = false;
        }
        lastScrollY = currentScrollY;
        return;
      }

      // Scrolling down - hide
      if (currentScrollY > lastScrollY && !isHidden) {
        gsap.to(navRef.current, {
          y: -100,
          duration: DURATION.normal,
          ease: EASE.smooth,
        });
        isHidden = true;
      }

      // Scrolling up - show
      if (currentScrollY < lastScrollY && isHidden) {
        gsap.to(navRef.current, {
          y: 0,
          duration: DURATION.normal,
          ease: EASE.smooth,
        });
        isHidden = false;
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cinematic Navbar entrance animation
  useLayoutEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      // Navbar slides down
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: DURATION.medium, ease: EASE.cinematic }
      );

      // Stagger nav links with premium timing
      gsap.fromTo(
        ".nav-link",
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: DURATION.normal,
          stagger: DURATION.stagger?.fast || 0.05,
          delay: 0.3,
          ease: EASE.smooth,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Cinematic Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current || !mobileOverlayRef.current) return;

    if (isMobileMenuOpen) {
      // Overlay fade in with blur
      gsap.fromTo(
        mobileOverlayRef.current,
        { opacity: 0, backdropFilter: "blur(0px)" },
        {
          opacity: 1,
          backdropFilter: "blur(8px)",
          duration: DURATION.normal,
          ease: EASE.smooth,
        }
      );

      // Menu slides in from left
      gsap.fromTo(
        mobileMenuRef.current,
        { x: "-100%" },
        { x: "0%", duration: DURATION.medium, ease: EASE.cinematic }
      );

      // Stagger menu items
      gsap.fromTo(
        ".mobile-nav-link",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: DURATION.normal,
          stagger: 0.05,
          delay: 0.15,
          ease: EASE.smooth,
        }
      );
    }
  }, [isMobileMenuOpen]);

  // Close menu with animation
  const closeMobileMenu = () => {
    if (!mobileMenuRef.current || !mobileOverlayRef.current) {
      setIsMobileMenuOpen(false);
      return;
    }

    gsap.to(mobileMenuRef.current, {
      x: "-100%",
      duration: DURATION.normal,
      ease: EASE.smooth,
    });

    gsap.to(mobileOverlayRef.current, {
      opacity: 0,
      duration: DURATION.normal,
      ease: EASE.smooth,
      onComplete: () => setIsMobileMenuOpen(false),
    });
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const linkStyle = (path) =>
    `nav-link font-medium transition-colors ${isActive(path) ? "text-[#0067FF]" : "text-gray-700 hover:text-gray-900"
    }`;

  return (
    <>
      <nav
        ref={navRef}
        className="w-full fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 shadow-sm"
      >
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
            <img src="newLogo.png" className="h-10 md:h-12 w-auto" alt="Logo" />
          </Link>

          {/* Right Nav Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/about" className={linkStyle("/about")}>
              About us
            </Link>
            <Link to="/contact" className={linkStyle("/contact")}>
              Contact us
            </Link>
            {isSignedIn && (
              <Link to="/track-order" className={linkStyle("/track-order")}>
                Track Order
              </Link>
            )}
            {/* Admin Dashboard Link — only for admins */}
            {isAdmin && (
              <Link to="/admin" className={`nav-link font-medium transition-colors ${isActive("/admin") ? "text-[#0067FF]" : "text-gray-700 hover:text-gray-900"
                }`}>
                <span className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Dashboard
                </span>
              </Link>
            )}
          </div>

          {/* Icons */}
          <div className="flex gap-2 md:gap-4 items-center flex-shrink-0">
            {/* Favourite - Hidden on mobile, shown on desktop */}
            <Link to="/favourite" className="relative hidden md:block">
              <button
                className={`p-2 transition-colors ${isActive("/favourite")
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
                className={`p-2 transition-colors ${isActive("/panier")
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
            {/* Account - Clerk UserButton or SignInButton */}
            <div className="hidden md:block">
              {isSignedIn ? (
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 border-2 border-blue-500 hover:border-blue-600 transition-colors",
                    },
                  }}
                />
              ) : (
                <SignInButton mode="modal">
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
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Cinematic Animation */}
      {isMobileMenuOpen && (
        <div
          ref={mobileOverlayRef}
          className="md:hidden fixed inset-0 z-[100] bg-black/50"
          onClick={closeMobileMenu}
        >
          <div
            ref={mobileMenuRef}
            className="fixed inset-y-0 left-0 w-[80%] max-w-[300px] bg-white shadow-2xl flex flex-col overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-blue-600">Menu</h2>
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors hover:rotate-90 duration-300"
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
                onClick={closeMobileMenu}
                className="mobile-nav-link block px-6 py-4 text-lg font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:pl-8"
              >
                Home
              </Link>
              <Link
                to="/collection"
                onClick={closeMobileMenu}
                className="mobile-nav-link block px-6 py-4 text-lg font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:pl-8"
              >
                Collection
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className="mobile-nav-link block px-6 py-4 text-lg font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:pl-8"
              >
                About us
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="mobile-nav-link block px-6 py-4 text-lg font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:pl-8"
              >
                Contact us
              </Link>
              {isSignedIn && (
                <Link
                  to="/track-order"
                  onClick={closeMobileMenu}
                  className="mobile-nav-link block px-6 py-4 text-lg font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:pl-8"
                >
                  Track Order
                </Link>
              )}
              {/* Admin link in mobile menu */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="mobile-nav-link block px-6 py-4 text-lg font-medium text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:pl-8 border-t border-gray-100 mt-2"
                >
                  <span className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    Admin Dashboard
                  </span>
                </Link>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-gray-200 p-4 mt-auto">
              <div className="grid grid-cols-2 gap-3">
                {isSignedIn ? (
                  <>
                    <Link
                      to="/account"
                      onClick={closeMobileMenu}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-blue-50 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500">
                        {user?.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <span className="text-lg font-bold text-white">
                              {user?.firstName?.[0]?.toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Profile
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                      }}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-red-50 transition-all duration-300"
                    >
                      <UserButton afterSignOutUrl="/" />
                      <span className="text-sm font-medium text-gray-500">
                        Account
                      </span>
                    </button>
                  </>
                ) : (
                  <SignInButton mode="modal">
                    <button
                      onClick={closeMobileMenu}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-blue-50 transition-all duration-300"
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
                    </button>
                  </SignInButton>
                )}
                <Link
                  to="/favourite"
                  onClick={closeMobileMenu}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-pink-50 transition-all duration-300 border border-gray-100"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span className="text-xs font-medium text-gray-700">
                    Wishlist
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
