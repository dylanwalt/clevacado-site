"use client";

import { useRef } from "react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import AnalyticsDashboardMockup from "./AnalyticsDashboardMockup";
import SectionLabel from "./SectionLabel";

export default function DashboardSection() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      gsap.from(".dashboard-copy", {
        autoAlpha: 0,
        y: 24,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 76%",
          toggleActions: "play none none none",
        },
      });

      if (!prefersReducedMotion) {
        gsap.from(".dashboard-mock", {
          autoAlpha: 0,
          y: 26,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".dashboard-mock",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section
      id="dashboard"
      ref={rootRef}
      className="px-6 py-24 sm:py-28"
      style={{ background: "#F7FFF8" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel className="dashboard-copy justify-center">
            The dashboard
          </SectionLabel>
          <h2
            data-display="true"
            className="dashboard-copy text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            ClevaCado Analytics makes the sorting hotspot obvious.
          </h2>
          <p className="dashboard-copy mt-5 text-lg leading-relaxed text-slate-600">
            The dashboard is built to tell one clear story: where handling risk
            peaks, what happened there, and what the team should change next.
          </p>
        </div>

        <div className="dashboard-mock mt-14">
          <AnalyticsDashboardMockup />
        </div>
      </div>
    </section>
  );
}
