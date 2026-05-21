"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Journey", href: "#journey" },
  { label: "Technology", href: "#technology" },
  { label: "Analytics", href: "#dashboard" },
  { label: "Customers", href: "#audience" },
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
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-5"
          style={{
            background: scrolled
              ? "rgba(255,253,247,0.92)"
              : "rgba(255,253,247,0.78)",
            backdropFilter: scrolled
              ? "saturate(180%) blur(22px)"
              : "saturate(180%) blur(14px)",
            borderColor: scrolled
              ? "rgba(47,143,70,0.18)"
              : "rgba(47,143,70,0.10)",
            boxShadow: scrolled
              ? "0 18px 50px rgba(23,77,42,0.10)"
              : "0 10px 36px rgba(23,77,42,0.06)",
          }}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="ClevaCado home"
          >
            <BrandLogo
              markSize={40}
              subtitle="Farm-to-market diagnostics"
              titleClassName="sm:text-lg"
              subtitleClassName="hidden text-[11px] tracking-[0.08em] uppercase md:block"
            />
          </button>

          <div className="hidden items-center gap-6 xl:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm font-medium transition-colors hover:text-slate-950 focus:outline-none"
                style={{ color: "#5E6B61" }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("#cta")}
              className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
              style={{
                background: "#5ED143",
                color: "#174D2A",
                boxShadow: "0 14px 30px rgba(94,209,67,0.24)",
              }}
            >
              Request pilot
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-950 focus:outline-none xl:hidden"
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
            className="fixed left-4 right-4 top-[86px] z-40 overflow-hidden rounded-[28px] border xl:hidden sm:left-6 sm:right-6"
            style={{
              background: "rgba(255,253,247,0.94)",
              backdropFilter: "saturate(180%) blur(18px)",
              borderColor: "rgba(47,143,70,0.14)",
              boxShadow: "0 20px 60px rgba(23,77,42,0.10)",
            }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5">
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
                  background: "#5ED143",
                  color: "#174D2A",
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
