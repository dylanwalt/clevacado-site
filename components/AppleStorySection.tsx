"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import ProductRender from "./ProductRender";

type StoryStep = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  metric: string;
  tone: "light" | "dark";
  pose: { x: number; y: number; rotate: number; scale: number };
  bg: string;
};

const STEPS: StoryStep[] = [
  {
    id: "impact",
    eyebrow: "THE PROBLEM",
    title: "Invisible damage is still damage.",
    body: "By the time bruising becomes visible, it’s too late to know where it happened. ClevaCado turns handling into measurable events—right at the point of impact.",
    metric: "Detects shocks & drops",
    tone: "light",
    pose: { x: 0, y: 12, rotate: -6, scale: 1.02 },
    bg: "radial-gradient(900px 560px at 50% 30%, rgba(239,68,68,0.10) 0%, rgba(255,255,255,0) 60%), linear-gradient(180deg, #ffffff 0%, #ffffff 100%)",
  },
  {
    id: "vibration",
    eyebrow: "IN MOTION",
    title: "Every transfer. Every vibration.",
    body: "From bins and conveyors to storage and transport, ClevaCado records the movement patterns that quietly reduce quality over time.",
    metric: "3‑axis vibration exposure",
    tone: "light",
    pose: { x: 26, y: -6, rotate: 7, scale: 0.98 },
    bg: "radial-gradient(900px 560px at 50% 30%, rgba(16,185,129,0.12) 0%, rgba(255,255,255,0) 60%), linear-gradient(180deg, #ffffff 0%, #ffffff 100%)",
  },
  {
    id: "hotspots",
    eyebrow: "PINPOINT",
    title: "Find the hotspots. Fix the process.",
    body: "Stop guessing. ClevaCado highlights the stages that create the most risk—so teams can change the one step that saves the most fruit.",
    metric: "Stage‑by‑stage risk scoring",
    tone: "dark",
    pose: { x: -18, y: -18, rotate: 0, scale: 1.06 },
    bg: "radial-gradient(900px 560px at 50% 30%, rgba(16,185,129,0.22) 0%, rgba(2,6,23,0) 60%), linear-gradient(180deg, #020617 0%, #000000 100%)",
  },
  {
    id: "dashboard",
    eyebrow: "RESULT",
    title: "A clear story in one dashboard.",
    body: "Turn raw motion data into decision-ready insight: what happened, where it happened, and what to change next.",
    metric: "Report‑ready diagnostics",
    tone: "light",
    pose: { x: 0, y: 10, rotate: 4, scale: 1.0 },
    bg: "radial-gradient(900px 560px at 50% 30%, rgba(2,132,199,0.10) 0%, rgba(255,255,255,0) 60%), linear-gradient(180deg, #ffffff 0%, #ffffff 100%)",
  },
] as const;

export default function AppleStorySection() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(
      STEPS.length - 1,
      Math.max(0, Math.floor(v * STEPS.length + 0.02)),
    );
    setActive((prev) => (prev === next ? prev : next));
  });

  const step = STEPS[active];

  const jumpTo = (i: number) => {
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    window.scrollTo({
      top: top + i * window.innerHeight,
      behavior: shouldReduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <section
      id="story"
      ref={containerRef}
      className="relative"
      style={{ height: `${STEPS.length * 115}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{ background: step.bg }}
            aria-hidden="true"
          />
        </AnimatePresence>

        <div className="relative mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-6 pb-12 pt-24 lg:grid-cols-2 lg:gap-14">
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={`copy-${step.id}`}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p
                  className="text-xs font-semibold tracking-[0.24em]"
                  style={{
                    color:
                      step.tone === "dark"
                        ? "rgba(255,255,255,0.65)"
                        : "rgb(71 85 105)",
                  }}
                >
                  {step.eyebrow}
                </p>
                <h2
                  className="mt-4 text-pretty text-4xl font-semibold tracking-tight sm:text-5xl"
                  style={{
                    color:
                      step.tone === "dark" ? "white" : "rgb(2 6 23)",
                  }}
                >
                  {step.title}
                </h2>
                <p
                  className="mt-5 max-w-xl text-pretty text-base leading-relaxed sm:text-lg"
                  style={{
                    color:
                      step.tone === "dark"
                        ? "rgba(255,255,255,0.70)"
                        : "rgb(71 85 105)",
                  }}
                >
                  {step.body}
                </p>

                <div
                  className="mt-8 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold"
                  style={{
                    borderColor:
                      step.tone === "dark"
                        ? "rgba(255,255,255,0.15)"
                        : "rgb(226 232 240)",
                    background:
                      step.tone === "dark"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(255,255,255,0.82)",
                    color:
                      step.tone === "dark"
                        ? "rgba(255,255,255,0.85)"
                        : "rgb(15 23 42)",
                    backdropFilter: "saturate(180%) blur(14px)",
                  }}
                >
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      background:
                        step.tone === "dark"
                          ? "rgb(52 211 153)"
                          : "rgb(5 150 105)",
                    }}
                    aria-hidden="true"
                  />
                  {step.metric}
                </div>
              </motion.div>
            </AnimatePresence>

            <div
              className="mt-10 flex items-center gap-2.5"
              role="tablist"
              aria-label="Story steps"
            >
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  role="tab"
                  aria-selected={i === active}
                  className="h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-4"
                  style={{
                    width: i === active ? 26 : 8,
                    background:
                      i === active
                        ? "rgb(16 185 129)"
                        : step.tone === "dark"
                          ? "rgba(255,255,255,0.22)"
                          : "rgb(203 213 225)",
                  }}
                />
              ))}
              <span
                className="ml-2 text-xs font-medium"
                style={{
                  color:
                    step.tone === "dark"
                      ? "rgba(255,255,255,0.45)"
                      : "rgb(100 116 139)",
                }}
                aria-hidden="true"
              >
                Scroll to advance
              </span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-center lg:justify-end">
            <AnimatePresence mode="wait">
              <motion.div
                key={`product-${step.id}`}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{
                  opacity: 1,
                  x: shouldReduceMotion ? 0 : step.pose.x,
                  y: shouldReduceMotion ? 0 : step.pose.y,
                  rotate: shouldReduceMotion ? 0 : step.pose.rotate,
                  scale: shouldReduceMotion ? 1 : step.pose.scale,
                }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 24,
                  mass: 0.8,
                }}
              >
                <ProductRender tone={step.tone} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

