"use client";

import { motion, useReducedMotion } from "framer-motion";
import ProductRender from "./ProductRender";

export default function AppleHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white px-6 pb-20 pt-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(800px 520px at 50% 35%, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.00) 60%), radial-gradient(700px 460px at 15% 25%, rgba(34,197,94,0.10) 0%, rgba(34,197,94,0.00) 55%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-6xl flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-xs font-semibold tracking-[0.28em] text-emerald-700"
        >
          CLEVACADO
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut", delay: 0.05 }}
          className="mt-5 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl md:text-7xl"
        >
          Where bruising begins.
          <span className="text-emerald-700"> Measured.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut", delay: 0.14 }}
          className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600 sm:text-xl"
        >
          ClevaCado travels through the avocado supply chain, measuring impact,
          vibration, rotation, and handling stress—so you can reduce damage and
          improve marketable yield.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.22 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#story"
            className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            See how it works
          </a>
          <a
            href="#cta"
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-950 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Request pilot
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut", delay: 0.18 }}
          className="mt-14 w-full"
        >
          <ProductRender className="mx-auto" />
          <p className="mt-6 text-xs font-medium tracking-wide text-slate-500">
            Scroll to explore
          </p>
        </motion.div>
      </div>
    </section>
  );
}

