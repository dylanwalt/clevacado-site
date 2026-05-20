"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import ClevaCadoLogo from "./ClevaCadoLogo";

const NAV_LINKS = [
  { label: "How it works", href: "#story" },
  { label: "Technology", href: "#technology" },
  { label: "Impact", href: "#impact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.76)"
            : "rgba(255,255,255,0.55)",
          backdropFilter: scrolled
            ? "saturate(180%) blur(18px)"
            : "saturate(180%) blur(10px)",
          borderColor: scrolled ? "rgba(15,23,42,0.08)" : "transparent",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo + wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="ClevaCado home"
          >
            <ClevaCadoLogo size={34} />
            <span className="text-base font-semibold tracking-tight text-slate-950 sm:text-lg">
              Cleva
              <span className="text-emerald-600">Cado</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 focus:outline-none"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("#cta")}
              className="inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Request pilot
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-950 focus:outline-none md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed left-0 right-0 top-[73px] z-40 border-b md:hidden"
            style={{
              background: "rgba(255,255,255,0.78)",
              backdropFilter: "saturate(180%) blur(18px)",
              borderColor: "rgba(15,23,42,0.08)",
            }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="py-2 text-left text-sm font-medium text-slate-950 focus:outline-none"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNav("#cta")}
                className="inline-flex h-10 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm focus:outline-none"
              >
                Request pilot
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
