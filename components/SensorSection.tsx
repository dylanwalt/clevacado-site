"use client";

import { useRef } from "react";
import { LineChart, RotateCcw, Vibrate, Zap } from "lucide-react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { TECHNOLOGY_FEATURES, TRUST_POINTS } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import ExplodedSensorDiagram from "./ExplodedSensorDiagram";
import SectionLabel from "./SectionLabel";

const FEATURE_ICONS = {
  impact: Zap,
  vibration: Vibrate,
  rotation: RotateCcw,
  profiling: LineChart,
} as const;

export default function SensorSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });

      reveal
        .from(".technology-copy", {
          autoAlpha: 0,
          y: 26,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        })
        .from(
          ".technology-feature",
          {
            autoAlpha: 0,
            y: 22,
            duration: 0.55,
            stagger: 0.1,
            ease: "power2.out",
          },
          0.24,
        )
        .from(
          ".technology-trust",
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.5,
            ease: "power2.out",
          },
          0.38,
        );

      if (!prefersReducedMotion) {
        gsap.to(".technology-chip", {
          y: -5,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          stagger: 0.08,
          ease: "sine.inOut",
        });
      }
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section id="technology" ref={rootRef} className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel className="technology-copy justify-center">
            The technology
          </SectionLabel>
          <h2
            data-display="true"
            className="technology-copy text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Built with inertial sensing for real-world avocado handling.
          </h2>
          <p className="technology-copy mt-5 text-lg leading-relaxed text-slate-600">
            ClevaCado uses embedded accelerometers and gyroscopes to capture
            how the device moves through real handling environments. It records
            shocks, drops, vibration exposure, rotation, and handling stress,
            then converts that motion data into supply-chain damage
            intelligence.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <ExplodedSensorDiagram />

          <div className="space-y-5">
            {TECHNOLOGY_FEATURES.map((feature) => {
              const Icon = FEATURE_ICONS[feature.id];

              return (
                <article
                  key={feature.id}
                  className="technology-feature rounded-[28px] border p-6"
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
                          className="technology-chip rounded-full px-3 py-1 text-xs font-semibold"
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
                </article>
              );
            })}
          </div>
        </div>

        <div
          className="technology-trust mt-12 rounded-[28px] border px-6 py-6"
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
        </div>
      </div>
    </section>
  );
}
