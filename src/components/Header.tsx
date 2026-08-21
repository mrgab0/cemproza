"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-surface dark:bg-on-background border-b border-outline-variant dark:border-on-surface-variant sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-gutter max-w-container-max mx-auto h-20">
        {/* Brand Logo */}
        <div className="relative h-20 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="CEMPROZA Cursos Logo" 
              className="absolute top-2 left-0 w-24 h-24 rounded-full border border-black object-cover bg-white z-50 shadow-md"
            />
            {/* Espaciador para no tapar el texto si hay texto al lado, o simplemente dejar el logo solo */}
            <span className="ml-28 font-headline-lg text-headline-lg font-black text-on-surface dark:text-surface-bright hidden sm:block">
              CEMPROZA Cursos
            </span>
          </Link>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#courses" className="text-primary dark:text-primary-fixed-dim font-bold border-b-2 border-primary pb-1">
            Cursos
          </Link>
          <Link href="#instructors" className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 pb-1 border-b-2 border-transparent">
            Instructores
          </Link>
          <Link href="#success" className="text-on-surface-variant dark:text-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 pb-1 border-b-2 border-transparent">
            Casos de Éxito
          </Link>
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <a aria-label="Instagram" href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-surface-container">
              <span className="material-symbols-outlined">camera_alt</span>
            </a>
            <a aria-label="TikTok" href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-surface-container">
              <span className="material-symbols-outlined">video_library</span>
            </a>
          </div>
          <Link href="#enroll" className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-6 py-3 rounded-lg hover:bg-primary-fixed transition-colors duration-200">
            Inscribirse
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button 
          aria-label="Toggle menu" 
          className="md:hidden p-2 text-on-surface hover:text-primary transition-colors focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="material-symbols-outlined text-[28px]">
            {isMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-surface-container-highest z-40 flex flex-col p-6 shadow-lg border-b border-outline-variant/30 animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-6">
            <Link href="#courses" onClick={() => setIsMenuOpen(false)} className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface hover:text-primary transition-colors border-b border-outline-variant/30 pb-4">
              Cursos
            </Link>
            <Link href="#instructors" onClick={() => setIsMenuOpen(false)} className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface hover:text-primary transition-colors border-b border-outline-variant/30 pb-4">
              Instructores
            </Link>
            <Link href="#success" onClick={() => setIsMenuOpen(false)} className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface hover:text-primary transition-colors border-b border-outline-variant/30 pb-4">
              Casos de Éxito
            </Link>
          </nav>
          
          <div className="mt-8 flex flex-col gap-4">
            <Link href="#enroll" onClick={() => setIsMenuOpen(false)} className="w-full bg-primary-container text-on-primary-container font-title-md py-4 px-6 rounded-lg shadow-[0_4px_20px_rgba(0,226,217,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform">
              Inscribirse <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
