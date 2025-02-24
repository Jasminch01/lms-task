"use client";
import { logoutUser } from "@/utls";
import useCurrentUser from "@/utls/UsecurrentUser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AppBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, loading } = useCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/')
  };

  return (
    <nav className="bg-[#2563EB] shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold">
              TechStack
            </Link>
          </div>

          {/* Toggle Button (Mobile) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-4 text-white">
            <Link href="/" className="hover:text-gray-200 transition">
              Home
            </Link>
            <Link href="#courses" className="hover:text-gray-200 transition">
              Courses
            </Link>
            <Link href="#about" className="hover:text-gray-200 transition">
              About
            </Link>
            {loading ? (
              <span>Loading...</span>
            ) : currentUser ? (
              <div className="relative">
                {/* Profile Avatar */}
                <div
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white font-semibold cursor-pointer shadow-md hover:bg-green-600 transition"
                >
                  {currentUser.name.slice(0, 1).toUpperCase()}
                </div>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <p className="px-4 py-2 text-gray-700 font-semibold">
                      {currentUser.name}
                    </p>
                    <p className="px-4 text-sm text-gray-500">
                      {currentUser.email}
                    </p>
                    <hr className="my-1" />

                    {currentUser.role === "admin" && (
                      <Link
                        href="admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                      >
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-white transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (Collapsible) */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#2563EB]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block text-white text-center hover:bg-gray-700 transition"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="#courses"
              className="block text-white text-center hover:bg-gray-700 transition"
              onClick={closeMenu}
            >
              Courses
            </Link>
            <Link
              href="#about"
              className="block text-white text-center hover:bg-gray-700 transition"
              onClick={closeMenu}
            >
              About
            </Link>
            {currentUser ? (
              <>
                <div className="flex justify-center items-center p-2">
                  <div
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white font-semibold cursor-pointer shadow-md hover:bg-green-600 transition"
                  >
                    {currentUser.name.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                {dropdownOpen && (
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <p className="px-4 py-2 text-gray-700 font-semibold">
                      {currentUser.name}
                    </p>
                    <p className="px-4 text-sm text-gray-500">
                      {currentUser.email}
                    </p>
                    <hr className="my-1" />

                    {currentUser.role === "admin" && (
                      <Link
                        href="admin/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                        onClick={closeMenu}
                      >
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="block text-white text-center hover:bg-gray-700 transition"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
