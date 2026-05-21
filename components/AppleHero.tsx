"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Radar, Sparkles, Waypoints } from "lucide-react";
import { HERO_CHIPS } from "@/lib/constants";
import ClevaCadoLogo from "./ClevaCadoLogo";

const VISUAL_CHIPS = [
  { label: HERO_CHIPS[0], top: "12%", left: "8%" },
  { label: HERO_CHIPS[1], top: "18%", right: "7%" },
  { label: HERO_CHIPS[2], top: "54%", left: "1%" },
  { label: HERO_CHIPS[3], bottom: "16%", left: "12%" },
  { label: HERO_CHIPS[4], bottom: "20%", right: "4%" },
] as const;

const HERO_DETAILS = [
  {
    icon: Waypoints,
    label: "7 stages tracked",
  },
  {
    icon: Radar,
    label: "3-axis motion sensing",
  },
  {
    icon: Sparkles,
    label: "Hidden bruising hotspots",
  },
] as const;

export default function AppleHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:pb-24 sm:pt-36">
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(circle at 50% 16%, rgba(57,211,83,0.18), transparent 34%), linear-gradient(180deg, #FFFFFF 0%, #F7FFF8 44%, #FFFFFF 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.055) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0) 85%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em]"
            style={{
              borderColor: "rgba(34,197,94,0.18)",
              background: "rgba(255,255,255,0.82)",
              color: "#166534",
            }}
          >
            Post-harvest diagnostics tool
          </span>
          <h1
            data-display="true"
            className="mt-7 text-balance text-[clamp(3rem,8vw,7rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-slate-950"
          >
            Meet the smart avocado that finds where bruising begins.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-slate-600 sm:text-xl">
            ClevaCado travels through the avocado supply chain, measuring
            impact, vibration, rotation, and handling stress so producers can
            reduce damage, improve fruit quality, and protect more value from
            every harvest.
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium text-emerald-700 sm:text-base">
            ClevaCado helps avocado producers find and reduce bruising-risk
            hotspots from farm to market.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#journey"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
              style={{
                background: "#39D353",
                color: "#052E16",
                boxShadow: "0 14px 30px rgba(57,211,83,0.24)",
              }}
            >
              Follow the journey
              <ArrowRight size={16} />
            </a>
            <a
              href="#cta"
              className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-bold transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
              style={{
                background: "#FFFFFF",
                borderColor: "#22C55E",
                color: "#15803D",
              }}
            >
              Request pilot
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="mx-auto mt-16 w-full max-w-6xl"
        >
          <div
            className="relative overflow-hidden rounded-[36px] border px-5 py-10 sm:px-10 sm:py-14"
            style={{
              borderColor: "rgba(34,197,94,0.16)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
              boxShadow: "0 28px 90px rgba(22,101,52,0.12)",
            }}
          >
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(57,211,83,0.28) 0%, rgba(57,211,83,0.02) 72%)",
              }}
              aria-hidden="true"
            />

            <div className="hidden min-h-[440px] items-center justify-center md:flex">
              <div className="relative h-[440px] w-full">
                {VISUAL_CHIPS.map((chip, index) => (
                  <motion.div
                    key={chip.label}
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: [0, -8, 0],
                          }
                    }
                    transition={{
                      duration: 4 + index * 0.45,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inline-flex rounded-full border px-4 py-2 text-sm font-semibold"
                    style={{
                      ...chip,
                      borderColor: "rgba(34,197,94,0.18)",
                      background: "rgba(255,255,255,0.92)",
                      color: "#166534",
                      boxShadow: "0 12px 30px rgba(22,101,52,0.08)",
                    }}
                  >
                    {chip.label}
                  </motion.div>
                ))}

                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: [0, -10, 0],
                          rotate: [0, 2, 0],
                        }
                  }
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <ClevaCadoLogo size={290} />
                </motion.div>
              </div>
            </div>

            <div className="flex flex-col items-center md:hidden">
              <ClevaCadoLogo size={230} />
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {HERO_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border px-4 py-2 text-sm font-semibold"
                    style={{
                      borderColor: "rgba(34,197,94,0.18)",
                      background: "rgba(255,255,255,0.92)",
                      color: "#166534",
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-3 border-t pt-7 sm:grid-cols-3">
              {HERO_DETAILS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.72)" }}
                  >
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ background: "#DCFCE7", color: "#166534" }}
                    >
                      <Icon size={20} />
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
