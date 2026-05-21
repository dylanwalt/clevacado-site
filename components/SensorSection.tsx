"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  LineChart,
  Radar,
  RotateCcw,
  ShieldCheck,
  Vibrate,
  Zap,
} from "lucide-react";
import { TECHNOLOGY_FEATURES, TRUST_POINTS } from "@/lib/constants";
import SectionLabel from "./SectionLabel";

const FEATURE_ICONS = {
  impact: Zap,
  vibration: Vibrate,
  rotation: RotateCcw,
  profiling: LineChart,
} as const;

function ExplodedSensorVisual() {
  const shouldReduceMotion = useReducedMotion();

  const layers = [
    {
      label: "Outer shell",
      detail: "Bright green shell that travels with the fruit",
      bg: "#ECFDF3",
      border: "rgba(34,197,94,0.16)",
      top: "8%",
      left: "16%",
      width: "68%",
    },
    {
      label: "Sensor module",
      detail: "Embedded accelerometer and gyroscope package",
      bg: "#FFFFFF",
      border: "rgba(34,197,94,0.16)",
      top: "30%",
      left: "20%",
      width: "60%",
    },
    {
      label: "Battery",
      detail: "Compact power layer for handling runs",
      bg: "#F7FFF8",
      border: "rgba(34,197,94,0.16)",
      top: "52%",
      left: "25%",
      width: "50%",
    },
    {
      label: "Data layer",
      detail: "Motion signals converted into handling intelligence",
      bg: "#FFFFFF",
      border: "rgba(34,197,94,0.16)",
      top: "72%",
      left: "18%",
      width: "64%",
    },
  ] as const;

  return (
    <div
      className="relative min-h-[540px] overflow-hidden rounded-[36px] border p-6"
      style={{
        borderColor: "rgba(34,197,94,0.15)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
        boxShadow: "0 24px 70px rgba(22,101,52,0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 28%, rgba(57,211,83,0.15), transparent 45%)",
        }}
        aria-hidden="true"
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 540"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M260 30C333 30 395 86 415 171C438 266 423 394 340 466C320 483 200 483 180 466C97 394 82 266 105 171C125 86 187 30 260 30Z"
          stroke="#A7F3D0"
          strokeWidth="2"
          strokeDasharray="8 10"
        />
        <line x1="260" y1="118" x2="260" y2="410" stroke="#DCFCE7" strokeWidth="2" strokeDasharray="6 10" />
      </svg>

      {layers.map((layer, index) => (
        <motion.div
          key={layer.label}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, index % 2 === 0 ? -6 : 6, 0],
                }
          }
          transition={{
            duration: 5 + index * 0.45,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-[28px] border px-5 py-4"
          style={{
            top: layer.top,
            left: layer.left,
            width: layer.width,
            background: layer.bg,
            borderColor: layer.border,
            boxShadow: "0 16px 40px rgba(22,101,52,0.06)",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {layer.label}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {layer.detail}
          </p>
          {layer.label === "Sensor module" && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Impact", "Vibration", "Rotation"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border px-3 py-2 text-center text-xs font-semibold text-slate-700"
                  style={{ borderColor: "rgba(34,197,94,0.12)" }}
                >
                  {item}
                </span>
              ))}
            </div>
          )}
          {layer.label === "Data layer" && (
            <div className="mt-4 flex items-center gap-3">
              <Radar size={18} color="#15803D" />
              <ShieldCheck size={18} color="#15803D" />
              <LineChart size={18} color="#15803D" />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function SensorSection() {
  return (
    <section id="technology" className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <SectionLabel className="justify-center">The technology</SectionLabel>
          <h2
            data-display="true"
            className="text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Built with inertial sensing for real-world avocado handling.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            ClevaCado uses embedded accelerometers and gyroscopes to capture
            how the device moves through real handling environments. It records
            shocks, drops, vibration exposure, rotation, and handling stress,
            then converts that motion data into supply-chain damage
            intelligence.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <ExplodedSensorVisual />
          </motion.div>

          <div className="space-y-5">
            {TECHNOLOGY_FEATURES.map((feature, index) => {
              const Icon = FEATURE_ICONS[feature.id];

              return (
                <motion.article
                  key={feature.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className="rounded-[28px] border p-6"
                  style={{
                    borderColor: "rgba(34,197,94,0.15)",
                    background: "#FFFFFF",
                    boxShadow: "0 20px 60px rgba(22,101,52,0.08)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
                      style={{ background: "#DCFCE7", color: "#166534" }}
                    >
                      <Icon size={22} />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3
                          data-display="true"
                          className="text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                        >
                          {feature.title}
                        </h3>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            background: "#ECFDF3",
                            color: "#166534",
                          }}
                        >
                          {feature.metric}
                        </span>
                      </div>
                      <p className="mt-3 text-base leading-relaxed text-slate-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-12 rounded-[28px] border px-6 py-6"
          style={{
            borderColor: "rgba(34,197,94,0.15)",
            background: "#F7FFF8",
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">
            Designed for real handling environments
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {TRUST_POINTS.map((point) => (
              <span
                key={point}
                className="rounded-full border px-4 py-2 text-sm font-semibold text-slate-700"
                style={{
                  borderColor: "rgba(34,197,94,0.14)",
                  background: "#FFFFFF",
                }}
              >
                {point}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
