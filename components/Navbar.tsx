"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/data";
import { GearPlayLogo } from "./icons";
import StartHereModal from "./StartHereModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/90 backdrop-blur-md border-b border-card-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg sm:text-xl font-bold tracking-[0.2em] uppercase text-white"
            >
              <GearPlayLogo className="w-8 h-8 sm:w-9 sm:h-9 text-steel" />
              GEARED LIKE A MACHINE
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                  className="text-sm uppercase tracking-widest text-muted hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => setModalOpen(true)}
                className="bg-steel text-black px-5 py-2 text-sm uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors duration-200 cursor-pointer"
              >
                Scope Your Project
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-white p-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              <div className="space-y-1.5">
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                    mobileOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                    mobileOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                    mobileOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            mobileOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="bg-black/95 backdrop-blur-md border-t border-card-border px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href.startsWith("#") ? `/${link.href}` : link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm uppercase tracking-widest text-muted hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                setModalOpen(true);
              }}
              className="inline-block bg-steel text-black px-5 py-2 text-sm uppercase tracking-widest font-semibold mt-2 cursor-pointer"
            >
              Scope Your Project
            </button>
          </div>
        </div>
      </nav>

      <StartHereModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
