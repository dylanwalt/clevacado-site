"use client";

import { useRef } from "react";
import {
  Leaf,
  LineChart,
  PackageCheck,
  ShieldCheck,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { IMPACT_CARDS, IMPACT_STRIP } from "@/lib/constants";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionLabel from "./SectionLabel";

const IMPACT_ICONS = [
  TrendingUp,
  PackageCheck,
  ShieldCheck,
  LineChart,
  Leaf,
  Workflow,
];

export default function ImpactSection() {
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
        .from(".impact-copy", {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        })
        .from(
          ".impact-strip",
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.18,
        )
        .from(
          ".impact-card",
          {
            autoAlpha: 0,
            y: 24,
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
          },
          0.26,
        );

      if (!prefersReducedMotion) {
        gsap.to(".impact-parallax", {
          yPercent: -8,
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
    <section id="impact" ref={rootRef} className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionLabel className="impact-copy">The impact</SectionLabel>
            <h2
              data-display="true"
              className="impact-copy text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
            >
              Less damage. Better quality. More value from every harvest.
            </h2>
            <p className="impact-copy mt-5 text-lg leading-relaxed text-slate-600">
              Post-harvest quality losses can be difficult to trace without
              handling data. ClevaCado helps teams see where quality is being
              pressured so they can improve the right part of the process.
            </p>

            <div
              className="impact-copy impact-parallax mt-8 rounded-[28px] border p-6"
              style={{
                borderColor: "rgba(34,197,94,0.15)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
                boxShadow: "0 24px 70px rgba(22,101,52,0.08)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                The operating outcome
              </p>
              <p
                data-display="true"
                className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-950"
              >
                Clearer handling decisions at the exact point where quality is
                being lost.
              </p>
            </div>
          </div>

          <div>
            <div className="grid gap-4 md:grid-cols-3">
              {IMPACT_STRIP.map((item) => (
                <div
                  key={item}
                  className="impact-strip rounded-[24px] border px-5 py-5 text-center"
                  style={{
                    borderColor: "rgba(34,197,94,0.14)",
                    background: "#F7FFF8",
                  }}
                >
                  <p className="text-sm font-semibold text-slate-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {IMPACT_CARDS.map((card, index) => {
                const Icon = IMPACT_ICONS[index];

                return (
                  <article
                    key={card.id}
                    className="impact-card rounded-[28px] border p-7"
                    style={{
                      borderColor: "rgba(34,197,94,0.15)",
                      background: "#FFFFFF",
                      boxShadow: "0 20px 60px rgba(22,101,52,0.08)",
                    }}
                  >
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ background: "#DCFCE7", color: "#166534" }}
                    >
                      <Icon size={22} />
                    </span>
                    <h3
                      data-display="true"
                      className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                    >
                      {card.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-slate-600">
                      {card.description}
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
