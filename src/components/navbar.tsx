"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/types";
import { type Locale, INTRANET_LOCALES } from "@/i18n/config";
import { LanguageSwitcher } from "./language-switcher";
import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect, useCallback } from "react";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
}

export function Navbar({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const { user, loading } = useAuth();

  const intranetLang = INTRANET_LOCALES.includes(lang) ? lang : "en";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch projects for the menu
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(
          "https://dcxxyawykywszehghzyb.supabase.co/rest/v1/projects?select=id,title,slug,category&is_archived=eq.false&published_at=not.is.null&order=sort_order.asc",
          {
            headers: {
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjeHh5YXd5a3l3c3plaGdoenliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3OTQxMTQsImV4cCI6MjA4ODM3MDExNH0.1UM0FtWflGWTVAu6KmjkOW9uBfzV5L6LGvFRXzv_aZY",
            },
          }
        );
        const data = await res.json();
        if (Array.isArray(data)) setProjects(data);
      } catch {
        // silently fail — menu just won't show project links
      }
    }
    fetchProjects();
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToProject = useCallback(
    (slug: string) => {
      setMenuOpen(false);
      // Small delay to allow overlay to close
      setTimeout(() => {
        const el = document.getElementById(`project-${slug}`);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);
    },
    []
  );

  if (pathname.includes("/intranet")) {
    return null;
  }

  const navLinks = [
    { href: `/${lang}`, label: dict.nav.home },
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/programs`, label: dict.nav.work },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`;

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-black/80 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link
            href={`/${lang}`}
            className="text-lg font-medium tracking-wide text-white z-10"
          >
            {dict.metadata.title}
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-opacity ${
                  pathname === link.href
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher lang={lang} />
            {!loading &&
              (user ? (
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
              ))}
          </div>

          {/* Hamburger — always visible */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-10 p-2 text-white"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

        <div className="relative z-10 h-full overflow-y-auto pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-16">
            {/* Left column — Projects */}
            {projects.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-6">
                  Projects
                </p>
                <div className="space-y-1">
                  {projects.map((project, i) => (
                    <button
                      key={project.id}
                      onClick={
                        isHomePage
                          ? () => scrollToProject(project.slug)
                          : undefined
                      }
                      className="w-full text-left group flex items-baseline gap-4 py-2 hover:pl-2 transition-all duration-200"
                    >
                      <span className="text-[10px] text-white/20 font-mono tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-lg sm:text-xl text-white/60 group-hover:text-white transition-colors duration-200 font-light">
                        {project.title}
                      </span>
                      <span className="text-[10px] text-white/20 ml-auto">
                        {project.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Right column — Navigation + auth */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-6">
                Navigation
              </p>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-lg sm:text-xl font-light py-2 transition-colors duration-200 ${
                      pathname === link.href
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                <LanguageSwitcher lang={lang} />
                {!loading && (
                  <div>
                    {user ? (
                      <Link
                        href={`/${intranetLang}/intranet`}
                        onClick={() => setMenuOpen(false)}
                        className="text-sm text-white/40 hover:text-white transition-colors"
                      >
                        {dict.nav.intranet}
                      </Link>
                    ) : (
                      <Link
                        href={`/${intranetLang}/signin`}
                        onClick={() => setMenuOpen(false)}
                        className="text-sm text-white/40 hover:text-white transition-colors"
                      >
                        {dict.nav.signIn}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
