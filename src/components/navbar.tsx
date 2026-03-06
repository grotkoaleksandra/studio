"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/types";
import { type Locale, INTRANET_LOCALES } from "@/i18n/config";
import { LanguageSwitcher } from "./language-switcher";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";

export function Navbar({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();

  const intranetLang = INTRANET_LOCALES.includes(lang) ? lang : "en";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.includes("/intranet")) {
    return null;
  }

  const links = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/programs`, label: dict.nav.work },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href={`/${lang}`} className="text-lg font-medium tracking-wide text-white">
          {dict.metadata.title}
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-opacity ${
                pathname === link.href ? "text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <LanguageSwitcher lang={lang} />
          {!loading && (
            user ? (
              <Link
                href={`/${intranetLang}/intranet`}
                className="text-sm px-4 py-1.5 border border-white/30 text-white hover:bg-white hover:text-black transition-all rounded"
              >
                {dict.nav.intranet}
              </Link>
            ) : (
              <Link
                href={`/${intranetLang}/signin`}
                className="text-sm px-4 py-1.5 border border-white/30 text-white hover:bg-white hover:text-black transition-all rounded"
              >
                {dict.nav.signIn}
              </Link>
            )
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-black/95 backdrop-blur-md px-6 py-6 space-y-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block text-sm tracking-wide ${
                pathname === link.href ? "text-white" : "text-white/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <LanguageSwitcher lang={lang} />
          </div>
          {!loading && (
            <div className="pt-2">
              {user ? (
                <Link
                  href={`/${intranetLang}/intranet`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-white/50 hover:text-white"
                >
                  {dict.nav.intranet}
                </Link>
              ) : (
                <Link
                  href={`/${intranetLang}/signin`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-white/50 hover:text-white"
                >
                  {dict.nav.signIn}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
