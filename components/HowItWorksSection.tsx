"use client";

import { useRef } from "react";
import { Activity, MapPin, Package } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import BrandLogo from "./BrandLogo";
import SectionLabel from "./SectionLabel";

const STEP_ICONS = [Package, Activity, MapPin];
const STEP_TAGS = [
  "Stage coverage",
  "Sensor capture",
  "Decision output",
] as const;

const SUMMARY_CHIPS = [
  "Harvest to market visibility",
  "Embedded motion sensing",
  "Actionable handling diagnostics",
] as const;

export default function HowItWorksSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 76%",
          toggleActions: "play none none none",
        },
      });

      reveal
        .from(".how-copy", {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        })
        .from(
          ".how-overview",
          {
            autoAlpha: 0,
            y: 26,
            duration: 0.8,
            ease: "power3.out",
          },
          0.18,
        )
        .from(
          ".how-step-card",
          {
            autoAlpha: 0,
            y: 24,
            duration: 0.6,
            stagger: 0.12,
            ease: "power2.out",
          },
          0.28,
        );

      if (!prefersReducedMotion) {
        gsap.to(".how-float", {
          y: -8,
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          stagger: 0.08,
          ease: "sine.inOut",
        });

        gsap.to(".how-parallax", {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section id="how-it-works" ref={rootRef} className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel className="how-copy justify-center">
            How ClevaCado works
          </SectionLabel>
          <h2
            data-display="true"
            className="how-copy text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            From movement data to decisions farmers can act on.
          </h2>
          <p className="how-copy mt-5 text-lg leading-relaxed text-slate-600">
            ClevaCado is a post-harvest diagnostics tool for avocado supply
            chains. It follows the fruit, captures hidden handling stress, and
            shows producers where bruising begins.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <div
              className="how-overview relative overflow-hidden rounded-[32px] border p-7 sm:p-8"
              style={{
                borderColor: "rgba(34,197,94,0.15)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
                boxShadow: "0 24px 70px rgba(22,101,52,0.08)",
              }}
            >
              <div
                className="how-parallax pointer-events-none absolute right-[-40px] top-[-30px] h-[180px] w-[180px] rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(57,211,83,0.22) 0%, rgba(57,211,83,0.02) 72%)",
                }}
                aria-hidden="true"
              />
              <BrandLogo
                markSize={56}
                subtitle="Diagnostics loop"
                titleClassName="text-xl"
                subtitleClassName="text-[11px] uppercase tracking-[0.08em]"
              />
              <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600">
                The product is simple at the operating level: run ClevaCado
                through the same journey as the fruit, capture the stress
                profile, then fix the stage causing the most hidden damage.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {SUMMARY_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="how-float rounded-full border px-4 py-2 text-sm font-semibold text-slate-700"
                    style={{
                      borderColor: "rgba(34,197,94,0.14)",
                      background: "#FFFFFF",
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 rounded-[24px] border p-5" style={{ borderColor: "rgba(34,197,94,0.12)", background: "rgba(255,255,255,0.9)" }}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  What the team gets back
                </p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-600">
                      Stage-by-stage risk profile
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      Harvest → Market
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-600">
                      Highest-risk point
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      Sorting transfer line
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-600">
                      Next action
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      Reduce drop height
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative pl-0 sm:pl-6">
            <div
              className="absolute bottom-8 left-[21px] top-8 hidden w-px sm:block"
              style={{
                background:
                  "linear-gradient(180deg, rgba(57,211,83,0.26) 0%, rgba(57,211,83,0.04) 100%)",
              }}
              aria-hidden="true"
            />

            <div className="space-y-5">
              {HOW_IT_WORKS_STEPS.map((step, index) => {
                const Icon = STEP_ICONS[index];

                return (
                  <article
                    key={step.id}
                    className="how-step-card relative rounded-[28px] border p-7"
                    style={{
                      background: "#FFFFFF",
                      borderColor: "rgba(34,197,94,0.15)",
                      boxShadow: "0 20px 60px rgba(22,101,52,0.08)",
                    }}
                  >
                    <span
                      className="absolute left-[-6px] top-9 hidden h-4 w-4 rounded-full border-4 sm:block"
                      style={{
                        borderColor: "#ECFDF3",
                        background: "#39D353",
                      }}
                    />
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span
                          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                          style={{ background: "#DCFCE7", color: "#166534" }}
                        >
                          <Icon size={20} />
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                            {STEP_TAGS[index]}
                          </p>
                          <p className="mt-2 text-sm font-semibold tracking-[0.18em] text-slate-400">
                            {step.number}
                          </p>
                        </div>
                      </div>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ background: "#ECFDF3", color: "#166534" }}
                      >
                        Step {step.number}
                      </span>
                    </div>
                    <h3
                      data-display="true"
                      className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                    >
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
