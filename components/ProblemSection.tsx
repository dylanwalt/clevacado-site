"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import SectionLabel from "./SectionLabel";

function AvoWithBruises({ progress }: { progress: number }) {
  const bruise1 = Math.min(1, Math.max(0, (progress - 0.2) * 2.5));
  const bruise2 = Math.min(1, Math.max(0, (progress - 0.35) * 2.5));
  const bruise3 = Math.min(1, Math.max(0, (progress - 0.5) * 2.5));
  const dataReveal = Math.min(1, Math.max(0, (progress - 0.65) * 3));

  return (
    <div className="relative flex items-center justify-center" style={{ width: 240, height: 300 }}>
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(57,211,83,0.10) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <svg
        width={200}
        height={260}
        viewBox="0 0 200 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M 100 12 C 125 12 157 38 166 76 C 175 114 170 162 152 186 C 140 202 60 202 48 186 C 30 162 25 114 34 76 C 43 38 75 12 100 12 Z"
          fill="#4ADE80"
          stroke="#22C55E"
          strokeWidth="2"
        />
        <path
          d="M 100 22 C 120 22 148 44 156 78 C 164 112 160 154 144 176 C 134 190 66 190 56 176 C 40 154 36 112 44 78 C 52 44 80 22 100 22 Z"
          fill="#F7FFF8"
        />
        {/* Bruise 1 */}
        <ellipse cx="72" cy="75" rx="16" ry="10" fill="#7C3AED" opacity={bruise1 * 0.22} />
        {/* Bruise 2 */}
        <ellipse cx="130" cy="105" rx="13" ry="8" fill="#6D28D9" opacity={bruise2 * 0.20} />
        {/* Bruise 3 */}
        <ellipse cx="88" cy="135" rx="18" ry="11" fill="#7C3AED" opacity={bruise3 * 0.18} />
        {/* Pit */}
        <ellipse cx="100" cy="140" rx="28" ry="36" fill="#166534" opacity="0.85" />
        <ellipse cx="96" cy="134" rx="10" ry="14" fill="#15803D" opacity="0.45" />
        {/* Measurement rings */}
        <circle cx="72" cy="75" r="22" fill="none" stroke="#39D353" strokeWidth="2" strokeDasharray="4 3" opacity={dataReveal * 0.85} />
        <circle cx="130" cy="105" r="18" fill="none" stroke="#FACC15" strokeWidth="2" strokeDasharray="4 3" opacity={dataReveal * 0.85} />
        <circle cx="88" cy="135" r="24" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 3" opacity={dataReveal * 0.85} />
        {/* Labels */}
        <text x="96" y="51" textAnchor="middle" fontSize="8" fill="#39D353" fontWeight="700" opacity={dataReveal}>2.1 g</text>
        <text x="152" y="93" textAnchor="middle" fontSize="8" fill="#FACC15" fontWeight="700" opacity={dataReveal}>3.1 g</text>
        <text x="116" y="152" textAnchor="middle" fontSize="8" fill="#EF4444" fontWeight="700" opacity={dataReveal}>4.8 g</text>
      </svg>

      {/* Tag: Impact mapped */}
      <div
        className="absolute top-8 right-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold pointer-events-none"
        style={{
          background: "rgba(255,255,255,0.96)",
          border: "1px solid #DCFCE7",
          color: "#1F2937",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          opacity: dataReveal,
          transform: `translateX(${(1 - dataReveal) * 14}px)`,
          transition: "opacity 0.3s, transform 0.3s",
        }}
        aria-hidden="true"
      >
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#EF4444" }} />
        Impact mapped
      </div>
      <div
        className="absolute bottom-14 left-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold pointer-events-none"
        style={{
          background: "rgba(255,255,255,0.96)",
          border: "1px solid #DCFCE7",
          color: "#1F2937",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          opacity: dataReveal,
          transform: `translateX(${(dataReveal - 1) * 14}px)`,
          transition: "opacity 0.3s, transform 0.3s",
        }}
        aria-hidden="true"
      >
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#FACC15" }} />
        Risk scored
      </div>
    </div>
  );
}

export default function ProblemSection() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const mapped = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);

  useMotionValueEvent(mapped, "change", (v) => setProgress(Math.min(1, Math.max(0, v))));

  return (
    <section ref={ref} id="problem" className="py-28 px-6 overflow-hidden" style={{ background: "white" }}>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <SectionLabel>THE PROBLEM</SectionLabel>
          <h2
            className="text-3xl md:text-4xl font-extrabold leading-tight mb-6"
            style={{ color: "#1F2937" }}
          >
            Bruising often happens{" "}
            <span style={{ color: "#39D353" }}>before anyone can see it.</span>
          </h2>
          <p className="text-lg leading-relaxed mb-6" style={{ color: "#6B7280" }}>
            By the time avocado damage becomes visible, producers often cannot tell
            whether it happened during harvesting, sorting, packing, cold storage,
            transport, or retail handling.
          </p>
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "#F7FFF8", border: "1px solid #DCFCE7" }}
          >
            <p className="text-base font-semibold leading-relaxed" style={{ color: "#1F2937" }}>
              &ldquo;An estimated{" "}
              <span style={{ color: "#39D353" }}>20–40%</span> of avocado
              post-harvest losses are linked to physical damage in the supply
              chain — much of it invisible until it reaches the consumer.&rdquo;
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-start gap-4 p-5 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(57,211,83,0.05), rgba(34,197,94,0.05))",
              border: "1px solid rgba(57,211,83,0.2)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
              style={{ background: "#DCFCE7" }}
            >
              🧠
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
              <strong>ClevaCado turns invisible handling damage into measurable supply-chain intelligence.</strong>{" "}
              Instead of guessing, producers get a clear, stage-by-stage picture of
              exactly where bruising risk is highest.
            </p>
          </motion.div>
        </motion.div>

        {/* Visual side */}
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <AvoWithBruises progress={progress} />
          <p className="text-sm text-center" style={{ color: "#9CA3AF" }}>
            ↑ Bruising sites revealed as you scroll
          </p>
        </motion.div>
      </div>
    </section>
  );
}
