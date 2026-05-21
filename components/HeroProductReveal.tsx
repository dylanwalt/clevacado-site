"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, BarChart3, Radar, Route } from "lucide-react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO_CHIPS } from "@/lib/constants";
import heroDevice from "@/public/assets/clevacado-hero-3d.png";
import BrandLogo from "./BrandLogo";
import ParallaxLayer from "./ParallaxLayer";

const HERO_METRICS = [
  {
    icon: Route,
    label: "Five story chapters",
  },
  {
    icon: Radar,
    label: "7-stage diagnostics",
  },
  {
    icon: BarChart3,
    label: "Sorting hotspot surfaced",
  },
] as const;

const VISUAL_CHIPS: Array<{
  label: (typeof HERO_CHIPS)[number];
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  speed: "slow" | "medium" | "fast";
}> = [
  { label: HERO_CHIPS[0], top: "20%", left: "4%", speed: "fast" },
  { label: HERO_CHIPS[1], top: "16%", right: "10%", speed: "medium" },
  { label: HERO_CHIPS[2], bottom: "16%", right: "6%", speed: "fast" },
];

const ORBIT_DOTS = [
  { className: "left-[20%] top-[26%]", size: "h-2.5 w-2.5", color: "#5ED143" },
  { className: "left-[74%] top-[24%]", size: "h-2 w-2", color: "#F6B73C" },
  { className: "left-[66%] top-[74%]", size: "h-2.5 w-2.5", color: "#F97316" },
  { className: "left-[26%] top-[74%]", size: "h-2 w-2", color: "#5ED143" },
] as const;

export default function HeroProductReveal() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      intro
        .from(".hero-copy", {
          autoAlpha: 0,
          y: 28,
          duration: 0.85,
          stagger: 0.08,
        })
        .from(
          ".hero-ring",
          {
            autoAlpha: 0,
            scale: 0.88,
            duration: 1,
            stagger: 0.08,
          },
          0.06,
        )
        .from(
          ".hero-device",
          {
            autoAlpha: 0,
            y: 42,
            scale: 0.95,
            duration: 1.2,
          },
          0.16,
        )
        .from(
          ".hero-chip",
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.7,
            stagger: 0.12,
          },
          0.34,
        )
        .from(
          ".hero-status",
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.55,
            stagger: 0.08,
          },
          0.42,
        )
        .from(
          ".hero-metric",
          {
            autoAlpha: 0,
            y: 14,
            duration: 0.5,
            stagger: 0.08,
          },
          0.64,
        );

      gsap.to(".hero-float", {
        y: -12,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-sensor-pulse", {
        scale: 1.18,
        opacity: 0.08,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils.toArray<HTMLElement>(".hero-orbit-dot").forEach((dot, index) => {
        gsap.to(dot, {
          x: index % 2 === 0 ? 10 : -10,
          y: index % 2 === 0 ? -14 : 14,
          duration: 4 + index * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.to(".hero-layer-slow", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-layer-medium", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-layer-fast", {
        yPercent: -26,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative overflow-hidden px-6 pb-20 pt-36 sm:pb-24 sm:pt-40"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(circle at 18% 18%, rgba(183,255,90,0.18), transparent 24%), radial-gradient(circle at 78% 24%, rgba(94,209,67,0.14), transparent 30%), linear-gradient(180deg, #FFFDF7 0%, #FAF8EF 44%, #FFFDF7 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at center, rgba(23,77,42,0.028) 0 1px, transparent 1px 34px)",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0) 88%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-center">
        <div className="grid items-center gap-12 lg:grid-cols-[0.94fr_1.06fr]">
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-[620px] lg:text-left">
            <div className="hero-copy inline-flex rounded-full border px-3 py-2 shadow-[0_12px_30px_rgba(23,77,42,0.08)] backdrop-blur-sm">
              <BrandLogo
                markSize={34}
                titleClassName="text-sm"
                subtitle="Operational intelligence from field to market"
                subtitleClassName="hidden text-[11px] tracking-[0.08em] uppercase sm:block"
                priority
              />
            </div>

            <h1
              data-display="true"
              className="hero-copy mt-7 text-[clamp(3.5rem,7vw,6.8rem)] font-semibold leading-[0.92] tracking-[-0.07em]"
              style={{ color: "#162118" }}
            >
              Meet the smart avocado that finds where bruising begins.
            </h1>
            <p className="hero-copy mx-auto mt-6 max-w-3xl text-pretty text-lg leading-relaxed sm:text-xl lg:mx-0">
              ClevaCado travels through the avocado supply chain, measuring
              impact, vibration, rotation, and handling stress so producers can
              spot the bruising hotspot and fix the process behind it.
            </p>

            <div className="hero-copy mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <a
                href="#journey"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                style={{
                  background: "#5ED143",
                  color: "#174D2A",
                  boxShadow: "0 16px 34px rgba(94,209,67,0.26)",
                }}
              >
                Follow the journey
                <ArrowRight size={16} />
              </a>
              <a
                href="#cta"
                className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                style={{
                  background: "rgba(255,253,247,0.92)",
                  borderColor: "rgba(47,143,70,0.28)",
                  color: "#174D2A",
                }}
              >
                Request pilot
              </a>
            </div>

            <div className="hero-copy mt-8 grid gap-3 sm:grid-cols-3">
              {HERO_METRICS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="hero-metric flex items-center gap-3 rounded-[24px] border px-4 py-4 text-left"
                    style={{
                      borderColor: "rgba(47,143,70,0.12)",
                      background: "rgba(255,253,247,0.78)",
                      boxShadow: "0 14px 40px rgba(23,77,42,0.05)",
                    }}
                  >
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ background: "#EAF5E5", color: "#2F8F46" }}
                    >
                      <Icon size={20} />
                    </span>
                    <span className="text-sm font-semibold" style={{ color: "#314238" }}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mx-auto w-full max-w-3xl lg:max-w-[760px]">
            <div
              className="relative overflow-hidden rounded-[44px] border px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
              style={{
                borderColor: "rgba(47,143,70,0.14)",
                background:
                  "linear-gradient(180deg, rgba(255,253,247,0.96) 0%, rgba(250,248,239,0.98) 100%)",
                boxShadow: "0 30px 90px rgba(23,77,42,0.10)",
              }}
            >
              <ParallaxLayer
                speed="slow"
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
              >
                <div
                  className="hero-ring absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{ borderColor: "rgba(47,143,70,0.10)" }}
                />
                <div
                  className="hero-ring absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{ borderColor: "rgba(94,209,67,0.18)" }}
                />
                <div
                  className="hero-ring absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{ borderColor: "rgba(183,255,90,0.28)" }}
                />
              </ParallaxLayer>

              <ParallaxLayer
                speed="slow"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(183,255,90,0.20) 0%, rgba(94,209,67,0.12) 32%, rgba(94,209,67,0.02) 72%)",
                }}
                aria-hidden="true"
              />

              <ParallaxLayer
                speed="medium"
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
              >
                {ORBIT_DOTS.map((dot) => (
                  <span
                    key={dot.className}
                    className={`hero-orbit-dot absolute rounded-full ${dot.className} ${dot.size}`}
                    style={{ background: dot.color }}
                  />
                ))}
              </ParallaxLayer>

              <div className="relative min-h-[380px] sm:min-h-[560px]">
                <ParallaxLayer
                  speed="medium"
                  className="hero-status absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border px-4 py-2"
                  style={{
                    borderColor: "rgba(47,143,70,0.14)",
                    background: "rgba(255,253,247,0.92)",
                    boxShadow: "0 14px 30px rgba(23,77,42,0.06)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#2F8F46" }}>
                    Diagnostics run #1042
                  </p>
                </ParallaxLayer>

                {VISUAL_CHIPS.map((chip) => (
                  <ParallaxLayer
                    key={chip.label}
                    speed={chip.speed}
                    className="absolute z-10 hidden md:block"
                    style={{
                      top: chip.top,
                      right: chip.right,
                      bottom: chip.bottom,
                      left: chip.left,
                    }}
                  >
                    <span
                      className="hero-chip inline-flex rounded-full border px-4 py-2 text-sm font-semibold"
                      style={{
                        borderColor: "rgba(47,143,70,0.16)",
                        background: "rgba(255,253,247,0.94)",
                        color: "#174D2A",
                        boxShadow: "0 12px 30px rgba(23,77,42,0.06)",
                      }}
                    >
                      {chip.label}
                    </span>
                  </ParallaxLayer>
                ))}

                <ParallaxLayer
                  speed="medium"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className="relative flex h-[320px] w-[320px] items-center justify-center rounded-full sm:h-[420px] sm:w-[420px] lg:h-[500px] lg:w-[500px]"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,253,247,0.96) 0%, rgba(234,245,229,0.78) 60%, rgba(255,253,247,0.24) 100%)",
                    }}
                  >
                    <div
                      className="hero-sensor-pulse absolute left-1/2 top-[68%] h-18 w-18 -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        height: 72,
                        width: 72,
                        background:
                          "radial-gradient(circle, rgba(183,255,90,0.38) 0%, rgba(94,209,67,0.14) 42%, rgba(94,209,67,0) 72%)",
                      }}
                    />
                    <div className="hero-float">
                      <Image
                        src={heroDevice}
                        alt="ClevaCado smart avocado device product render"
                        priority
                        sizes="(min-width: 1024px) 44vw, 88vw"
                        className="hero-device relative z-[1] mx-auto w-full max-w-[560px] object-contain drop-shadow-[0_34px_80px_rgba(23,77,42,0.16)]"
                      />
                    </div>
                  </div>
                </ParallaxLayer>

                <ParallaxLayer
                  speed="fast"
                  className="hero-status absolute bottom-6 left-6 z-20 max-w-[230px] rounded-[24px] border p-4"
                  style={{
                    borderColor: "rgba(47,143,70,0.14)",
                    background: "rgba(255,253,247,0.92)",
                    boxShadow: "0 16px 34px rgba(23,77,42,0.06)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#5E6B61" }}>
                    Hotspot found
                  </p>
                  <p
                    data-display="true"
                    className="mt-3 text-2xl font-semibold tracking-[-0.04em]"
                    style={{ color: "#174D2A" }}
                  >
                    Packhouse transfer line
                  </p>
                </ParallaxLayer>

                <div className="mt-6 flex flex-wrap justify-center gap-2 md:hidden">
                  {HERO_CHIPS.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border px-4 py-2 text-sm font-semibold"
                      style={{
                        borderColor: "rgba(47,143,70,0.16)",
                        background: "rgba(255,253,247,0.94)",
                        color: "#174D2A",
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
