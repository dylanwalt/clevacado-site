"use client";

import { useRef } from "react";
import { Factory, Leaf, Package, Truck } from "lucide-react";
import { AUDIENCE_CARDS } from "@/lib/constants";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import SectionLabel from "./SectionLabel";

const ICONS = [Leaf, Factory, Package, Truck];
const DECISION_CHIPS = [
  "Harvest handling",
  "Packhouse transfers",
  "Cold-chain movement",
  "Transport vibration",
] as const;

export default function AudienceSection() {
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
        .from(".audience-copy", {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        })
        .from(
          ".audience-chip",
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
          ".audience-card",
          {
            autoAlpha: 0,
            y: 26,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
          },
          0.28,
        );

      if (!prefersReducedMotion) {
        gsap.to(".audience-float", {
          y: -8,
          duration: 3,
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
    <section
      id="audience"
      ref={rootRef}
      className="px-6 py-24 sm:py-28"
      style={{ background: "#FFFFFF" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionLabel className="audience-copy">Who it is for</SectionLabel>
            <h2
              data-display="true"
              className="audience-copy text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
            >
              Built for every team protecting avocado quality.
            </h2>
            <p className="audience-copy mt-5 text-lg leading-relaxed text-slate-600">
              ClevaCado supports the people making handling decisions across
              the full supply chain, from the field to the packhouse to market
              arrival.
            </p>

            <div
              className="audience-copy mt-7 rounded-[28px] border p-6"
              style={{
                borderColor: "rgba(34,197,94,0.14)",
                background: "#F7FFF8",
                boxShadow: "0 18px 50px rgba(22,101,52,0.06)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Decisions ClevaCado clarifies
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {DECISION_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="audience-chip audience-float rounded-full border px-4 py-2 text-sm font-semibold text-slate-700"
                    style={{
                      borderColor: "rgba(34,197,94,0.14)",
                      background: "#FFFFFF",
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {AUDIENCE_CARDS.map((card, index) => {
              const Icon = ICONS[index];
              return (
                <article
                  key={card.id}
                  className="audience-card rounded-[28px] border p-7"
                  style={{
                    background: "#F7FFF8",
                    borderColor: "rgba(34,197,94,0.15)",
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
    </section>
  );
}
