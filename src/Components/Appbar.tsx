"use client";
import useCurrentUser from "@/utls/UsecurrentUser";
import Link from "next/link";
import { useState } from "react";

export default function AppBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logoutUser } = useCurrentUser();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  console.log(currentUser);

  return (
    <nav className="bg-[#2563EB] shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold ">
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
            <Link href="/" className="">
              Home
            </Link>
            <Link href="/courses" className="">
              Courses
            </Link>
            <Link href="#about" className="">
              About
            </Link>
            {currentUser ? (
              <button onClick={logoutUser}>Logout</button>
            ) : (
              <Link href="/login" className="">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (Collapsible) */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block text-white text-center">
              Home
            </Link>
            <Link href="/courses" className="block text-white text-center">
              Courses
            </Link>
            <Link href="#about" className="block text-white text-center">
              About
            </Link>
            <Link href="/login" className="block text-white text-center">
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
