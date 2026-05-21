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
      style={{ background: "#FAF8EF" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel className="dashboard-copy justify-center">
            The dashboard
          </SectionLabel>
          <h2
            data-display="true"
            className="dashboard-copy text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl"
            style={{ color: "#162118" }}
          >
            The hotspot becomes obvious.
          </h2>
          <p className="dashboard-copy mt-5 text-lg leading-relaxed" style={{ color: "#5E6B61" }}>
            ClevaCado turns one diagnostic run into a clear answer: where the
            risk peaked, what happened, and what to fix next.
          </p>
        </div>

        <div className="dashboard-mock mt-14">
          <AnalyticsDashboardMockup />
        </div>
      </div>
    </section>
  );
}
