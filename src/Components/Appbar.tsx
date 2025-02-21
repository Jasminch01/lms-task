"use client"
import Link from "next/link";
import { useState } from "react";

export default function AppBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#2563EB] shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold ">
              TechLearn
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
            <Link href="/" className="">
              Home
            </Link>
            <a href="/courses" className="">
              Courses
            </a>
            <a href="/about" className="">
              About
            </a>
            <a href="/contact" className="">
              Contact
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Collapsible) */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block text-gray-800 hover:text-gray-600">
              Home
            </Link>
            <a
              href="/courses"
              className="block text-gray-800 hover:text-gray-600"
            >
              Courses
            </a>
            <a
              href="/about"
              className="block text-gray-800 hover:text-gray-600"
            >
              About
            </a>
            <a
              href="/contact"
              className="block text-gray-800 hover:text-gray-600"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
