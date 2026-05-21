"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/constants";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import heroDevice from "@/public/assets/clevacado-hero-3d.png";
import BrandLogo from "./BrandLogo";

const CTA_CHIPS = [
  "Designed for real handling environments",
  "Farm-to-market diagnostics",
  "Clearer post-harvest decisions",
] as const;

export default function FinalCTA() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      reveal
        .from(".cta-visual", {
          autoAlpha: 0,
          scale: 0.97,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          ".cta-copy",
          {
            autoAlpha: 0,
            y: 22,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.14,
        )
        .from(
          ".cta-chip",
          {
            autoAlpha: 0,
            y: 16,
            duration: 0.45,
            stagger: 0.06,
            ease: "power2.out",
          },
          0.28,
        );

      if (!prefersReducedMotion) {
        gsap.to(".cta-device", {
          y: -10,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".cta-parallax", {
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
    <section
      id="cta"
      ref={rootRef}
      className="relative overflow-hidden px-6 py-24 sm:py-28"
      style={{
        background:
          "linear-gradient(180deg, #FFFFFF 0%, #F7FFF8 44%, #FFFFFF 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(57,211,83,0.18) 0%, transparent 38%)",
        }}
        aria-hidden="true"
      />

      <div
        className="mx-auto max-w-6xl overflow-hidden rounded-[40px] border px-6 py-10 sm:px-10 sm:py-14"
        style={{
          borderColor: "rgba(34,197,94,0.15)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
          boxShadow: "0 28px 90px rgba(22,101,52,0.12)",
        }}
      >
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div
            className="cta-visual relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[32px] border px-4 py-6"
            style={{
              borderColor: "rgba(34,197,94,0.14)",
              background:
                "radial-gradient(circle at 50% 38%, rgba(57,211,83,0.22), rgba(255,255,255,0) 56%)",
            }}
          >
            <div
              className="cta-parallax absolute left-6 top-6 rounded-[24px] border bg-white/90 p-4 shadow-[0_16px_38px_rgba(22,101,52,0.08)]"
              style={{ borderColor: "rgba(34,197,94,0.14)" }}
            >
              <BrandLogo variant="stacked" stackedWidth={140} />
            </div>
            <div className="cta-device relative z-[1]">
              <Image
                src={heroDevice}
                alt="ClevaCado device render"
                sizes="(min-width: 1024px) 36vw, 82vw"
                className="mx-auto w-full max-w-[420px] object-contain drop-shadow-[0_26px_60px_rgba(22,101,52,0.18)]"
              />
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
              {CTA_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="cta-chip rounded-full border px-4 py-2 text-sm font-semibold text-slate-700"
                  style={{
                    borderColor: "rgba(34,197,94,0.14)",
                    background: "rgba(255,255,255,0.9)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2
              data-display="true"
              className="cta-copy text-balance text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl"
            >
              Ready to make avocado damage measurable?
            </h2>
            <p className="cta-copy mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              ClevaCado is being developed to help farms, packhouses, and
              supply-chain partners understand where bruising starts and how to
              reduce it.
            </p>

            <div className="cta-copy mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Pilot Request`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                style={{
                  background: "#39D353",
                  color: "#052E16",
                  boxShadow: "0 14px 30px rgba(57,211,83,0.24)",
                }}
              >
                Request pilot
                <ArrowRight size={16} />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Contact ClevaCado`}
                className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-bold transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                style={{
                  background: "#FFFFFF",
                  borderColor: "#22C55E",
                  color: "#15803D",
                }}
              >
                Contact ClevaCado
              </a>
            </div>

            <p className="cta-copy mt-7 text-sm font-semibold text-emerald-700">
              The smart avocado for better post-harvest decisions.
            </p>
          </div>
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm sm:flex-row"
          style={{ borderColor: "rgba(34,197,94,0.12)" }}
        >
          <BrandLogo
            markSize={30}
            titleClassName="text-sm"
            subtitle="Post-harvest diagnostics"
            subtitleClassName="text-[11px] uppercase tracking-[0.08em]"
          />
          <p className="text-slate-500">
            Post-harvest diagnostics for avocado supply chains.
          </p>
        </div>
      </div>
    </section>
  );
}
