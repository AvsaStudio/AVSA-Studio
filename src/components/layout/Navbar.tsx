"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/booking", label: "Book" },
  { href: "/dashboard", label: "My Bookings" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/90 backdrop-blur-sm border-b border-stone-200">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-medium tracking-widest uppercase text-[var(--charcoal)] hover:opacity-70 transition-opacity"
        >
          AVSA Studio
        </Link>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-sm tracking-wide transition-colors ${
                  pathname === href
                    ? "text-[var(--charcoal)] font-medium"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/login"
              className="inline-flex items-center justify-center h-9 px-5 bg-[var(--charcoal)] text-white text-sm rounded-full hover:bg-stone-700 transition-colors"
            >
              Sign In
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 text-stone-600"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-stone-200 bg-[var(--background)] px-6 py-4 space-y-3">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-stone-700 py-2"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium text-[var(--charcoal)] py-2"
          >
            Sign In →
          </Link>
        </div>
      )}
    </header>
  );
}
