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
        // silently fail
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

  const scrollToProject = useCallback((slug: string) => {
    setMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`project-${slug}`);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 100);
  }, []);

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
      {/* A24-style sticky transparent header */}
      <nav className="fixed top-0 w-full z-50 bg-transparent">
        <div className="w-full px-6 sm:px-10 flex items-center justify-between h-16">
          {/* Left — Menu trigger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-[60] flex items-center gap-2 text-white group"
            aria-label="Toggle menu"
          >
            <span className="text-xs uppercase tracking-[0.15em] font-medium group-hover:opacity-70 transition-opacity">
              {menuOpen ? "Close" : "Menu"}
            </span>
          </button>

          {/* Center — Logo */}
          <Link
            href={`/${lang}`}
            className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold tracking-widest uppercase text-white z-[60]"
          >
            {dict.metadata.title}
          </Link>

          {/* Right — Language */}
          <div className="relative z-[60]">
            <LanguageSwitcher lang={lang} />
          </div>
        </div>
      </nav>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black transition-all duration-700 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="relative z-10 h-full overflow-y-auto pt-24 pb-12 px-6 sm:px-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-16 sm:gap-24">
            {/* Left column — Projects */}
            {projects.length > 0 && (
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-8">
                  Projects
                </p>
                <div className="space-y-0">
                  {projects.map((project, i) => (
                    <button
                      key={project.id}
                      onClick={
                        isHomePage
                          ? () => scrollToProject(project.slug)
                          : undefined
                      }
                      className="w-full text-left group flex items-baseline gap-5 py-3 border-b border-white/5 hover:border-white/20 transition-all duration-300"
                    >
                      <span className="text-[11px] text-white/25 font-mono tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-2xl sm:text-3xl text-white/70 group-hover:text-white transition-colors duration-300 font-light tracking-tight">
                        {project.title}
                      </span>
                      <span className="text-[11px] text-white/25 ml-auto uppercase tracking-wider">
                        {project.category}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Right column — Navigation + auth */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-8">
                Navigation
              </p>
              <div className="space-y-0">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-2xl sm:text-3xl font-light tracking-tight py-3 border-b border-white/5 transition-all duration-300 ${
                      pathname === link.href
                        ? "text-white"
                        : "text-white/70 hover:text-white hover:border-white/20"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                {!loading && (
                  <div>
                    {user ? (
                      <Link
                        href={`/${intranetLang}/intranet`}
                        onClick={() => setMenuOpen(false)}
                        className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-wider"
                      >
                        {dict.nav.intranet}
                      </Link>
                    ) : (
                      <Link
                        href={`/${intranetLang}/signin`}
                        onClick={() => setMenuOpen(false)}
                        className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-wider"
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
