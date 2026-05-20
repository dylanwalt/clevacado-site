"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import AvoDevice from "./AvoDevice";
import SectionLabel from "./SectionLabel";

const DATA_CHIPS = [
  {
    label: "Impact detected",
    delay: 0.4,
    top: "16%",
    left: "2%",
    color: "#39D353",
  },
  {
    label: "3.8 g shock",
    delay: 0.65,
    top: "14%",
    right: "4%",
    color: "#EF4444",
  },
  {
    label: "Vibration mapped",
    delay: 0.85,
    bottom: "34%",
    left: "1%",
    color: "#FACC15",
  },
];

export default function HeroSection() {
  const handleScrollToJourney = () => {
    const el = document.querySelector("#journey");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  const handleScrollToCTA = () => {
    const el = document.querySelector("#cta");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F7FFF8 0%, #ffffff 100%)" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(57,211,83,0.12) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto w-full relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SectionLabel>MEET CLEVACADO</SectionLabel>
          </motion.div>

          {/* Device visual */}
          <div className="relative w-72 h-80 sm:w-80 sm:h-96 mx-auto my-10 flex items-center justify-center">
            {/* Glow ring */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(57,211,83,0.18) 0%, transparent 65%)",
              }}
              aria-hidden="true"
            />

            {/* Floating data chips */}
            {DATA_CHIPS.map((chip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: chip.delay,
                  duration: 0.45,
                  ease: "easeOut",
                }}
                className="absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap select-none"
                style={{
                  top: chip.top,
                  left: chip.left,
                  right: (chip as { right?: string }).right,
                  bottom: (chip as { bottom?: string }).bottom,
                  background: "rgba(255,255,255,0.95)",
                  border: `1px solid ${chip.color}22`,
                  boxShadow: `0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px ${chip.color}18`,
                  color: "#1F2937",
                  backdropFilter: "blur(8px)",
                }}
                aria-hidden="true"
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
                  style={{ background: chip.color }}
                />
                {chip.label}
              </motion.div>
            ))}

            {/* Avocado device — floating */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AvoDevice size={200} />
              </motion.div>
            </motion.div>
          </div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-8 max-w-3xl"
            style={{ color: "#1F2937" }}
          >
            Meet the smart avocado that finds{" "}
            <span style={{ color: "#39D353" }}>where bruising begins.</span>
          </motion.h1>

          {/* Subcopy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl"
            style={{ color: "#6B7280" }}
          >
            ClevaCado travels through the avocado supply chain, measuring
            impact, vibration, rotation, and handling stress so producers can
            reduce damage and improve marketable yield.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.55, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleScrollToJourney}
              className="font-semibold text-lg px-8 py-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: "#39D353",
                color: "#166534",
                boxShadow: "0 4px 20px rgba(57,211,83,0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#22C55E";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 28px rgba(57,211,83,0.45)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#39D353";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 20px rgba(57,211,83,0.35)";
              }}
            >
              See the journey
            </button>
            <button
              onClick={handleScrollToCTA}
              className="font-semibold text-lg px-8 py-4 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: "white",
                color: "#39D353",
                borderColor: "#39D353",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#F7FFF8";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 16px rgba(57,211,83,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "white";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              Request pilot
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "#6B7280" }}
        aria-hidden="true"
      >
        <span className="text-xs font-medium tracking-widest uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
