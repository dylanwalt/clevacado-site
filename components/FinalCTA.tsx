"use client";

import { motion } from "framer-motion";
import AvoDevice from "./AvoDevice";

export default function FinalCTA() {
  return (
    <section
      id="cta"
      className="py-32 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #ffffff 0%, #f8fafc 45%, #ffffff 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)",
          borderRadius: "50%",
        }}
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Avocado visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex justify-center mb-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <AvoDevice size={140} />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6"
          style={{ color: "#1F2937" }}
        >
          Ready to make avocado damage{" "}
          <span style={{ color: "#39D353" }}>measurable?</span>
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ color: "#6B7280" }}
        >
          ClevaCado is being developed to help farms, packhouses, and
          supply-chain partners understand where bruising starts and how to
          reduce it.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.25, duration: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <a
            href="mailto:hello@clevacado.com?subject=Pilot Request"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-10 py-4 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Request a pilot
          </a>
          <a
            href="mailto:hello@clevacado.com?subject=Contact ClevaCado"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-10 py-4 text-center text-base font-semibold text-slate-950 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Contact ClevaCado
          </a>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm font-medium"
          style={{ color: "#9CA3AF" }}
        >
          Built for smarter avocado handling from farm to market.
        </motion.p>
      </div>

      {/* Footer strip */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-0 left-0 right-0 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{
          borderTop: "1px solid rgba(15,23,42,0.08)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-sm font-bold"
            style={{ color: "#1F2937" }}
          >
            Cleva<span style={{ color: "#39D353" }}>Cado</span>
          </span>
          <span className="text-xs" style={{ color: "#9CA3AF" }}>
            — The smart avocado supply-chain device
          </span>
        </div>
        <p className="text-xs" style={{ color: "#94A3B8" }}>
          © {new Date().getFullYear()} ClevaCado. All rights reserved.
        </p>
      </motion.footer>
    </section>
  );
}
