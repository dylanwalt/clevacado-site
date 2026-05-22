"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";

const NAV_LINKS = [
  { label: "Problem", href: "#problem" },
  { label: "Device", href: "#device" },
  { label: "Architecture", href: "#architecture" },
  { label: "Journey", href: "#journey" },
  { label: "Analytics", href: "#analytics" },
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
              ? "rgba(4,6,6,0.92)"
              : "rgba(4,6,6,0.72)",
            backdropFilter: "saturate(160%) blur(20px)",
            borderColor: scrolled
              ? "rgba(183,255,90,0.18)"
              : "rgba(183,255,90,0.08)",
            boxShadow: scrolled
              ? "0 18px 50px rgba(0,0,0,0.42)"
              : "0 10px 36px rgba(0,0,0,0.24)",
          }}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="ClevaCado home"
          >
            <BrandLogo variant="mark" markSize={36} priority />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-[-0.03em] text-white/90">
                ClevaCado
              </p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/38">
                Post-harvest diagnostics
              </p>
            </div>
          </button>

          <div className="hidden items-center gap-6 xl:flex">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm font-medium transition-colors hover:text-white/90 focus:outline-none"
                style={{ color: "rgba(246,247,242,0.56)" }}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("#cta")}
              className="inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-bold transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#B7FF5A]/40"
              style={{
                background: "#B7FF5A",
                color: "#040606",
                boxShadow: "0 8px 24px rgba(183,255,90,0.28)",
              }}
            >
              Request pilot
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-white/72 focus:outline-none xl:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
              background: "rgba(4,6,6,0.94)",
              backdropFilter: "saturate(160%) blur(20px)",
              borderColor: "rgba(183,255,90,0.14)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.48)",
            }}
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="py-2.5 text-left text-sm font-medium focus:outline-none"
                  style={{ color: "rgba(246,247,242,0.72)" }}
                >
                  {link.label}
                </button>
              ))}
              <div className="mt-3 border-t border-white/8 pt-4">
                <button
                  onClick={() => handleNav("#cta")}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-bold focus:outline-none"
                  style={{
                    background: "#B7FF5A",
                    color: "#040606",
                  }}
                >
                  Request pilot
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
