"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  LineChart,
  RotateCcw,
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
      detail: "Protective avocado shell built to move through handling flows",
      top: "11%",
      left: "3%",
    },
    {
      label: "Sensor core",
      detail: "Accelerometer and gyroscope package measuring shocks and motion",
      top: "29%",
      right: "2%",
    },
    {
      label: "Power layer",
      detail: "Compact battery stack sized for full supply-chain diagnostic runs",
      bottom: "22%",
      left: "6%",
    },
    {
      label: "Data layer",
      detail: "Motion signals translated into stage-by-stage risk intelligence",
      bottom: "8%",
      right: "4%",
    },
  ] as const;

  return (
    <div
      className="relative overflow-hidden rounded-[36px] border px-5 py-6 sm:px-6 sm:py-8"
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
      <div className="relative">
        <div className="relative mx-auto max-w-[660px]">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(57,211,83,0.24) 0%, rgba(255,255,255,0) 72%)",
            }}
            aria-hidden="true"
          />
          <motion.img
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    y: [0, -8, 0],
                  }
            }
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            src="assets/clevacado-exploded-3d.png"
            alt="Exploded ClevaCado product render showing shell, power, and sensing layers"
            className="relative z-[1] mx-auto w-full object-contain drop-shadow-[0_30px_70px_rgba(22,101,52,0.16)]"
          />

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
              className="absolute z-10 hidden max-w-[220px] rounded-[24px] border px-4 py-3 xl:block"
              style={{
                ...layer,
                borderColor: "rgba(34,197,94,0.16)",
                background: "rgba(255,255,255,0.9)",
                boxShadow: "0 16px 40px rgba(22,101,52,0.08)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {layer.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {layer.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:hidden">
          {layers.map((layer) => (
            <div
              key={layer.label}
              className="rounded-[22px] border px-4 py-4"
              style={{
                borderColor: "rgba(34,197,94,0.14)",
                background: "rgba(255,255,255,0.92)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {layer.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {layer.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {["Impact", "Vibration", "Rotation", "Risk profile"].map((item) => (
            <span
              key={item}
              className="rounded-full border px-4 py-2 text-sm font-semibold text-slate-700"
              style={{
                borderColor: "rgba(34,197,94,0.12)",
                background: "rgba(255,255,255,0.92)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
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
