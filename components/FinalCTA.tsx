"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/constants";
import ClevaCadoLogo from "./ClevaCadoLogo";

const CTA_CHIPS = [
  "Designed for real handling environments",
  "Farm-to-market diagnostics",
  "Clearer post-harvest decisions",
] as const;

export default function FinalCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="cta"
      className="relative overflow-hidden px-6 py-24 sm:py-28"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F7FFF8 44%, #FFFFFF 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(57,211,83,0.18) 0%, transparent 38%)",
        }}
        aria-hidden="true"
      />

      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-[40px] border px-6 py-10 sm:px-10 sm:py-14"
        style={{
          borderColor: "rgba(34,197,94,0.15)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
          boxShadow: "0 28px 90px rgba(22,101,52,0.12)",
        }}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative flex min-h-[360px] items-center justify-center rounded-[32px] border"
            style={{
              borderColor: "rgba(34,197,94,0.14)",
              background:
                "radial-gradient(circle at 50% 38%, rgba(57,211,83,0.22), rgba(255,255,255,0) 56%)",
            }}
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -10, 0],
                    }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ClevaCadoLogo size={220} />
            </motion.div>
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
              {CTA_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border px-4 py-2 text-sm font-semibold text-slate-700"
                  style={{
                    borderColor: "rgba(34,197,94,0.14)",
                    background: "rgba(255,255,255,0.9)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              data-display="true"
              className="text-balance text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl"
            >
              Ready to make avocado damage measurable?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600"
            >
              ClevaCado is being developed to help farms, packhouses, and
              supply-chain partners understand where bruising starts and how to
              reduce it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.14 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row"
            >
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Pilot Request`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                style={{
                  background: "#39D353",
                  color: "#052E16",
                  boxShadow: "0 14px 30px rgba(57,211,83,0.24)",
                }}
              >
                Request pilot
                <ArrowRight size={16} />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Contact ClevaCado`}
                className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-bold transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                style={{
                  background: "#FFFFFF",
                  borderColor: "#22C55E",
                  color: "#15803D",
                }}
              >
                Contact ClevaCado
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="mt-7 text-sm font-semibold text-emerald-700"
            >
              The smart avocado for better post-harvest decisions.
            </motion.p>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm sm:flex-row"
          style={{ borderColor: "rgba(34,197,94,0.12)" }}
        >
          <div className="flex items-center gap-3">
            <ClevaCadoLogo size={28} />
            <span className="font-semibold text-slate-900">ClevaCado</span>
          </div>
          <p className="text-slate-500">
            Post-harvest diagnostics for avocado supply chains.
          </p>
        </div>
      </div>
    </section>
  );
}
