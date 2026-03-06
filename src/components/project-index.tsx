"use client";

import { useState, useEffect } from "react";

interface Project {
  title: string;
  category: string;
  year: string;
}

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-");
}

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  // Show only after scrolling past the hero
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (title: string) => {
    const el = document.getElementById(`project-${slugify(title)}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
      setOpen(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [open]);

  return (
    <div
      className={`fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {/* Expanded list */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open
            ? "max-h-[600px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 translate-y-2"
        }`}
      >
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg p-5 min-w-[240px] shadow-2xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 mb-5">
            Index
          </p>
          <div className="space-y-0.5">
            {projects.map((project, i) => (
              <button
                key={project.title}
                onClick={() => scrollTo(project.title)}
                className="w-full text-left group flex items-baseline gap-3 py-2 px-2 -mx-2 rounded hover:bg-white/5 transition-all duration-200"
              >
                <span className="text-[10px] text-white/20 font-mono tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-white/60 group-hover:text-white transition-colors duration-200">
                  {project.title}
                </span>
                <span className="text-[10px] text-white/20 ml-auto">
                  {project.year}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-12 h-12 rounded-full backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-white/20 rotate-0"
            : "bg-white/10 hover:bg-white/15"
        }`}
        aria-label={open ? "Close project index" : "Open project index"}
      >
        <svg
          className={`w-5 h-5 text-white transition-transform duration-300 ${
            open ? "rotate-45" : "rotate-0"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
}
