"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import ClevaCadoLogo from "./ClevaCadoLogo";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Journey", href: "#journey" },
  { label: "Technology", href: "#technology" },
  { label: "Analytics", href: "#dashboard" },
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
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(255,255,255,0.84)"
            : "rgba(255,255,255,0.68)",
          backdropFilter: scrolled
            ? "saturate(180%) blur(18px)"
            : "saturate(180%) blur(12px)",
          borderColor: scrolled ? "rgba(34,197,94,0.14)" : "transparent",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="ClevaCado home"
          >
            <ClevaCadoLogo size={34} />
            <span
              className="text-base font-semibold tracking-tight sm:text-lg"
              style={{ color: "#052E16" }}
            >
              ClevaCado
            </span>
          </button>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm font-medium transition-colors hover:text-slate-950 focus:outline-none"
                style={{ color: "#4B5563" }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("#cta")}
              className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
              style={{
                background: "#39D353",
                color: "#052E16",
                boxShadow: "0 14px 30px rgba(57,211,83,0.24)",
              }}
            >
              Request pilot
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-950 focus:outline-none lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed left-0 right-0 top-[73px] z-40 border-b lg:hidden"
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "saturate(180%) blur(18px)",
              borderColor: "rgba(34,197,94,0.14)",
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
                className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-sm focus:outline-none"
                style={{
                  background: "#39D353",
                  color: "#052E16",
                }}
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
