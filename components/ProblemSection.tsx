"use client";

import { motion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import SectionLabel from "./SectionLabel";

function HiddenBruiseVisual() {
  return (
    <div
      className="relative overflow-hidden rounded-[32px] border px-6 py-8 sm:px-8"
      style={{
        borderColor: "rgba(34,197,94,0.15)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
        boxShadow: "0 20px 60px rgba(22,101,52,0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(57,211,83,0.16) 0%, transparent 56%)",
        }}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center">
        <div className="relative w-full max-w-[420px]">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(57,211,83,0.22) 0%, rgba(255,255,255,0) 72%)",
            }}
            aria-hidden="true"
          />
          <motion.img
            src="assets/clevacado-problem-xray.png"
            alt="ClevaCado diagnostic render showing hidden internal stress zones"
            className="relative z-[1] mx-auto w-full object-contain drop-shadow-[0_26px_55px_rgba(22,101,52,0.16)]"
          />
          <div
            className="absolute left-4 top-4 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 backdrop-blur-sm sm:left-6 sm:top-6"
            style={{
              borderColor: "rgba(34,197,94,0.18)",
              background: "rgba(255,255,255,0.88)",
            }}
          >
            External view
          </div>
          <div
            className="absolute bottom-6 right-2 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-600 backdrop-blur-sm sm:right-6"
            style={{
              borderColor: "rgba(251,146,60,0.22)",
              background: "rgba(255,255,255,0.9)",
            }}
          >
            Subsurface stress
          </div>
        </div>
        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
          <div
            className="rounded-2xl border px-4 py-3"
            style={{
              borderColor: "rgba(34,197,94,0.14)",
              background: "rgba(255,255,255,0.85)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Surface
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Looks clean and market-ready.
            </p>
          </div>
          <div
            className="rounded-2xl border px-4 py-3"
            style={{
              borderColor: "rgba(251,146,60,0.18)",
              background: "rgba(255,255,255,0.85)",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
              Hidden stress
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Sub-surface damage can already be building.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProblemSection() {
  return (
    <section
      id="problem"
      className="px-6 py-24 sm:py-28"
      style={{ background: "#F7FFF8" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <SectionLabel>THE PROBLEM</SectionLabel>
          <h2
            data-display="true"
            className="text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Avocado bruising is often invisible until it is too late.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            By the time bruising appears, producers may not know whether the
            damage happened during harvesting, sorting, packing, cold storage,
            transport, or retail handling. That makes it difficult to fix the
            real cause of quality loss.
          </p>
          <div
            className="mt-7 inline-flex items-center gap-3 rounded-full border px-4 py-3"
            style={{
              borderColor: "rgba(239,68,68,0.12)",
              background: "rgba(255,255,255,0.9)",
            }}
          >
            <CircleAlert size={18} color="#EF4444" />
            <span className="text-sm font-semibold text-slate-700">
              ClevaCado turns hidden handling damage into measurable data.
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <HiddenBruiseVisual />
        </motion.div>
      </div>
    </section>
  );
}
