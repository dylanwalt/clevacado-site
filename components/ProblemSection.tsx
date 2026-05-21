"use client";

import { motion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import ClevaCadoLogo from "./ClevaCadoLogo";
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

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 420"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="265" cy="214" r="112" stroke="#86EFAC" strokeWidth="2" strokeDasharray="8 10" opacity="0.55" />
        <circle cx="265" cy="214" r="78" stroke="#FACC15" strokeWidth="2" strokeDasharray="4 8" opacity="0.45" />
        <circle cx="265" cy="214" r="48" stroke="#FB923C" strokeWidth="2" strokeDasharray="3 8" opacity="0.38" />
        <circle cx="222" cy="192" r="8" fill="#FACC15" opacity="0.9" />
        <circle cx="302" cy="242" r="9" fill="#FB923C" opacity="0.9" />
        <circle cx="270" cy="164" r="7" fill="#EF4444" opacity="0.9" />
      </svg>

      <div className="relative flex flex-col items-center">
        <ClevaCadoLogo size={250} />
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
