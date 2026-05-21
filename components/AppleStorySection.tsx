"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { JOURNEY_STAGES, RISK_META } from "@/lib/constants";
import ClevaCadoLogo from "./ClevaCadoLogo";
import SectionLabel from "./SectionLabel";

const DESKTOP_PATH = "M14 84C18 76 18 72 21 68C26 61 33 57 38 53C44 48 49 43 53 39C58 34 63 31 68 28C73 24 78 20 82 17C85 14 88 11 90 8";

export default function AppleStorySection() {
  const shouldReduceMotion = useReducedMotion();
  const desktopRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: desktopRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const nextIndex = Math.min(
      JOURNEY_STAGES.length - 1,
      Math.max(0, Math.round(value * (JOURNEY_STAGES.length - 1))),
    );
    setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
  });

  const activeStage = JOURNEY_STAGES[activeIndex];
  const activeRisk = RISK_META[activeStage.riskLevel];

  const jumpToStage = (index: number) => {
    if (!desktopRef.current) return;

    const sectionTop = desktopRef.current.offsetTop;
    window.scrollTo({
      top: sectionTop + index * window.innerHeight * 0.7,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section id="journey" className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <SectionLabel className="justify-center">The journey</SectionLabel>
          <h2
            data-display="true"
            className="text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Follow ClevaCado from farm to market.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            ClevaCado travels with the fruit, captures hidden handling stress,
            and shows producers where bruising begins.
          </p>
        </motion.div>

        <div className="relative mt-14 pl-7">
          <div
            className="absolute bottom-0 left-3 top-5 w-px"
            style={{ background: "linear-gradient(180deg, #39D353 0%, rgba(57,211,83,0.12) 100%)" }}
            aria-hidden="true"
          />
          {JOURNEY_STAGES.map((stage, index) => {
            const risk = RISK_META[stage.riskLevel];

            return (
              <motion.article
                key={stage.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="relative mb-6 rounded-[28px] border p-6"
                style={{
                  borderColor: "rgba(34,197,94,0.15)",
                  background: "#FFFFFF",
                  boxShadow: "0 20px 60px rgba(22,101,52,0.08)",
                }}
              >
                <span
                  className="absolute left-[-34px] top-8 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white"
                  style={{
                    borderColor: "rgba(34,197,94,0.18)",
                  }}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: risk.color }}
                  />
                </span>
                {index === 0 && (
                  <div className="absolute left-[-58px] top-[-38px]">
                    <ClevaCadoLogo size={44} />
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                      {stage.number}
                    </p>
                    <h3
                      data-display="true"
                      className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                    >
                      {stage.label}
                    </h3>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: risk.soft,
                      color: risk.color,
                    }}
                  >
                    {risk.label}
                  </span>
                </div>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {stage.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-slate-800">
                  {stage.measurement}
                </p>
                <p className="mt-3 text-sm text-slate-500">{stage.event}</p>
              </motion.article>
            );
          })}
        </div>
      </div>

      <section
        ref={desktopRef}
        className="relative mx-auto hidden max-w-7xl lg:block"
        style={{ height: "500vh" }}
      >
        <div className="sticky top-0 flex h-screen items-center">
          <div className="grid w-full grid-cols-[0.92fr_1.08fr] gap-10">
            <div className="flex flex-col justify-center">
              <SectionLabel>The journey</SectionLabel>
              <h2
                data-display="true"
                className="max-w-xl text-balance text-5xl font-semibold tracking-[-0.05em] text-slate-950"
              >
                Follow ClevaCado from farm to market.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
                Each stage introduces different movement, shock, and vibration
                patterns. ClevaCado keeps the story visible from harvesting to
                market arrival.
              </p>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.id}
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="mt-9 rounded-[32px] border p-8"
                  style={{
                    borderColor: "rgba(34,197,94,0.15)",
                    background: "rgba(255,255,255,0.92)",
                    boxShadow: "0 24px 70px rgba(22,101,52,0.08)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                        Stage {activeStage.number}
                      </p>
                      <h3
                        data-display="true"
                        className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950"
                      >
                        {activeStage.label}
                      </h3>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: activeRisk.soft,
                        color: activeRisk.color,
                      }}
                    >
                      {activeRisk.label} risk
                    </span>
                  </div>

                  <p className="mt-5 text-base leading-relaxed text-slate-600">
                    {activeStage.description}
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div
                      className="rounded-2xl border px-4 py-4"
                      style={{
                        borderColor: "rgba(34,197,94,0.13)",
                        background: "#F7FFF8",
                      }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Measured
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {activeStage.measurement}
                      </p>
                    </div>
                    <div
                      className="rounded-2xl border px-4 py-4"
                      style={{
                        borderColor: "rgba(34,197,94,0.13)",
                        background: "#FFFFFF",
                      }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Data event
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {activeStage.event}
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-relaxed text-slate-500">
                    {activeStage.insight}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {JOURNEY_STAGES.map((stage, index) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => jumpToStage(index)}
                    className="inline-flex items-center justify-between rounded-full border px-4 py-3 text-left text-sm font-semibold transition-colors"
                    style={{
                      borderColor:
                        index === activeIndex
                          ? "rgba(34,197,94,0.24)"
                          : "rgba(34,197,94,0.12)",
                      background:
                        index === activeIndex ? "#ECFDF3" : "rgba(255,255,255,0.82)",
                      color: index === activeIndex ? "#166534" : "#475569",
                    }}
                  >
                    <span>{stage.short}</span>
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div
                className="relative h-[76vh] w-full overflow-hidden rounded-[36px] border"
                style={{
                  borderColor: "rgba(34,197,94,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
                  boxShadow: "0 24px 70px rgba(22,101,52,0.08)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(34,197,94,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.055) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                  }}
                  aria-hidden="true"
                />

                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d={DESKTOP_PATH}
                    stroke="#D1FAE5"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d={DESKTOP_PATH}
                    stroke="#39D353"
                    strokeOpacity="0.75"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeDasharray="3.2 2.8"
                  />
                  {JOURNEY_STAGES.map((stage, index) => {
                    const risk = RISK_META[stage.riskLevel];
                    const isActive = index === activeIndex;

                    return (
                      <g key={stage.id}>
                        <circle
                          cx={stage.position.x}
                          cy={stage.position.y}
                          r={isActive ? 3.6 : 2.5}
                          fill={risk.color}
                        />
                        <circle
                          cx={stage.position.x}
                          cy={stage.position.y}
                          r={isActive ? 6.5 : 0}
                          fill={risk.color}
                          opacity={0.12}
                        />
                      </g>
                    );
                  })}
                </svg>

                {JOURNEY_STAGES.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="absolute"
                    style={{
                      left: `${stage.position.x}%`,
                      top: `${stage.position.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute left-6 top-[-10px] rounded-full border px-3 py-1 text-xs font-semibold"
                      style={{
                        borderColor:
                          index === activeIndex
                            ? "rgba(34,197,94,0.18)"
                            : "rgba(34,197,94,0.10)",
                        background:
                          index === activeIndex
                            ? "rgba(255,255,255,0.96)"
                            : "rgba(255,255,255,0.82)",
                        color: index === activeIndex ? "#166534" : "#6B7280",
                        boxShadow:
                          index === activeIndex
                            ? "0 10px 30px rgba(22,101,52,0.08)"
                            : "none",
                      }}
                    >
                      {stage.label}
                    </div>
                  </div>
                ))}

                <motion.div
                  animate={{
                    left: `${activeStage.position.x}%`,
                    top: `${activeStage.position.y}%`,
                  }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 110, damping: 22 }
                  }
                  className="absolute"
                  style={{
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="rounded-full border border-emerald-100 bg-white p-3 shadow-[0_18px_36px_rgba(22,101,52,0.15)]">
                    <ClevaCadoLogo size={62} />
                  </div>
                </motion.div>

                <div
                  className="absolute right-6 top-6 max-w-[240px] rounded-[24px] border p-5"
                  style={{
                    borderColor: "rgba(34,197,94,0.12)",
                    background: "rgba(255,255,255,0.92)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Active risk
                  </p>
                  <p
                    className="mt-3 text-3xl font-semibold tracking-[-0.04em]"
                    style={{ color: activeRisk.color }}
                  >
                    {activeRisk.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {activeStage.label} introduces the current handling pattern
                    being measured.
                  </p>
                </div>

                <div
                  className="absolute bottom-6 left-6 max-w-[260px] rounded-[24px] border p-5"
                  style={{
                    borderColor: "rgba(34,197,94,0.12)",
                    background: "rgba(255,255,255,0.92)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    Live event
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    {activeStage.event}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {activeStage.measurement}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
