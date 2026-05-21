"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Radar, Sparkles, Waypoints } from "lucide-react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import { HERO_CHIPS } from "@/lib/constants";
import heroDevice from "@/public/assets/clevacado-hero-3d.png";
import ParallaxLayer from "./ParallaxLayer";

const VISUAL_CHIPS: Array<{
  label: (typeof HERO_CHIPS)[number];
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  speed: "slow" | "medium" | "fast";
}> = [
  { label: HERO_CHIPS[0], top: "14%", left: "7%", speed: "fast" },
  { label: HERO_CHIPS[1], top: "22%", right: "8%", speed: "medium" },
  { label: HERO_CHIPS[2], top: "58%", left: "3%", speed: "fast" },
  { label: HERO_CHIPS[3], bottom: "16%", left: "14%", speed: "medium" },
  { label: HERO_CHIPS[4], bottom: "22%", right: "6%", speed: "fast" },
];

const HERO_DETAILS = [
  {
    icon: Waypoints,
    label: "7 stages tracked",
  },
  {
    icon: Radar,
    label: "3-axis motion sensing",
  },
  {
    icon: Sparkles,
    label: "Hidden bruising hotspots",
  },
] as const;

const ORBIT_DOTS = [
  { className: "left-[18%] top-[24%]", size: "h-3 w-3", color: "#39D353" },
  { className: "left-[73%] top-[30%]", size: "h-2 w-2", color: "#FACC15" },
  { className: "left-[64%] top-[76%]", size: "h-3 w-3", color: "#FB923C" },
  { className: "left-[26%] top-[74%]", size: "h-2 w-2", color: "#39D353" },
] as const;

export default function HeroProductReveal() {
  const rootRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      intro
        .from(".hero-copy", {
          autoAlpha: 0,
          y: 26,
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
          0,
        )
        .from(
          ".hero-device",
          {
            autoAlpha: 0,
            y: 40,
            scale: 0.96,
            duration: 1.2,
          },
          0.18,
        )
        .from(
          ".hero-chip",
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.7,
            stagger: 0.12,
          },
          0.42,
        )
        .from(
          ".hero-metric",
          {
            autoAlpha: 0,
            y: 14,
            duration: 0.55,
            stagger: 0.08,
          },
          0.78,
        );

      gsap.to(".hero-float", {
        y: -12,
        duration: 3.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils.toArray<HTMLElement>(".hero-orbit-dot").forEach((dot, index) => {
        gsap.to(dot, {
          x: index % 2 === 0 ? 10 : -10,
          y: index % 2 === 0 ? -14 : 14,
          duration: 4 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.to(".hero-layer-slow", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-layer-medium", {
        yPercent: -22,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-layer-fast", {
        yPercent: -32,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-device-track", {
        yPercent: -8,
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
      className="relative overflow-hidden px-6 pb-20 pt-32 sm:pb-24 sm:pt-36"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(circle at 50% 14%, rgba(57,211,83,0.19), transparent 34%), linear-gradient(180deg, #FFFFFF 0%, #F7FFF8 44%, #FFFFFF 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.055) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0) 86%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-center">
        <div className="grid items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:max-w-2xl lg:text-left">
            <span
              className="hero-copy inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em]"
              style={{
                borderColor: "rgba(34,197,94,0.18)",
                background: "rgba(255,255,255,0.82)",
                color: "#166534",
              }}
            >
              Post-harvest diagnostics tool
            </span>
            <h1
              data-display="true"
              className="hero-copy mt-7 text-balance text-[clamp(3.5rem,8vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-slate-950"
            >
              Meet the smart avocado that finds where bruising begins.
            </h1>
            <p className="hero-copy mx-auto mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-slate-600 sm:text-xl lg:mx-0">
              ClevaCado travels through the avocado supply chain, measuring
              impact, vibration, rotation, and handling stress so producers can
              reduce damage, improve fruit quality, and protect more value from
              every harvest.
            </p>
            <p className="hero-copy mx-auto mt-5 max-w-2xl text-sm font-medium text-emerald-700 sm:text-base lg:mx-0">
              ClevaCado helps avocado producers find and reduce bruising-risk
              hotspots from farm to market.
            </p>

            <div className="hero-copy mt-8 lg:hidden">
              <div
                className="relative overflow-hidden rounded-[32px] border px-4 py-5"
                style={{
                  borderColor: "rgba(34,197,94,0.16)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
                  boxShadow: "0 24px 70px rgba(22,101,52,0.10)",
                }}
              >
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(57,211,83,0.26) 0%, rgba(57,211,83,0.02) 72%)",
                  }}
                  aria-hidden="true"
                />
                <Image
                  src={heroDevice}
                  alt="ClevaCado smart avocado device product render"
                  priority
                  sizes="84vw"
                  className="hero-device relative z-[1] mx-auto w-full max-w-[320px] object-contain drop-shadow-[0_22px_50px_rgba(22,101,52,0.18)]"
                />
              </div>
            </div>

            <div className="hero-copy mt-10 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <a
                href="#journey"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                style={{
                  background: "#39D353",
                  color: "#052E16",
                  boxShadow: "0 14px 30px rgba(57,211,83,0.24)",
                }}
              >
                Follow the journey
                <ArrowRight size={16} />
              </a>
              <a
                href="#cta"
                className="inline-flex h-12 items-center justify-center rounded-full border px-7 text-sm font-bold transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
                style={{
                  background: "#FFFFFF",
                  borderColor: "#22C55E",
                  color: "#15803D",
                }}
              >
                Request pilot
              </a>
            </div>
          </div>

          <div className="mx-auto hidden w-full max-w-3xl lg:block lg:max-w-none">
            <div
              className="relative overflow-hidden rounded-[40px] border px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12"
              style={{
                borderColor: "rgba(34,197,94,0.16)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
                boxShadow: "0 28px 90px rgba(22,101,52,0.12)",
              }}
            >
              <ParallaxLayer
                speed="slow"
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
              >
                <div
                  className="hero-ring absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{ borderColor: "rgba(57,211,83,0.12)" }}
                />
                <div
                  className="hero-ring absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{ borderColor: "rgba(57,211,83,0.18)" }}
                />
                <div
                  className="hero-ring absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{ borderColor: "rgba(57,211,83,0.24)" }}
                />
              </ParallaxLayer>

              <ParallaxLayer
                speed="slow"
                className="pointer-events-none absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(57,211,83,0.28) 0%, rgba(57,211,83,0.02) 72%)",
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

              <div className="relative min-h-[340px] sm:min-h-[460px]">
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
                        borderColor: "rgba(34,197,94,0.18)",
                        background: "rgba(255,255,255,0.92)",
                        color: "#166534",
                        boxShadow: "0 12px 30px rgba(22,101,52,0.08)",
                      }}
                    >
                      {chip.label}
                    </span>
                  </ParallaxLayer>
                ))}

                <ParallaxLayer
                  speed="medium"
                  className="hero-device-track absolute inset-0 flex items-center justify-center"
                >
                  <div className="hero-float">
                    <Image
                      src={heroDevice}
                      alt="ClevaCado smart avocado device product render"
                      priority
                      sizes="(min-width: 1024px) 46vw, 88vw"
                      className="hero-device relative z-[1] mx-auto w-full max-w-[680px] object-contain drop-shadow-[0_30px_70px_rgba(22,101,52,0.2)]"
                    />
                  </div>
                </ParallaxLayer>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2 md:hidden">
                {HERO_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border px-4 py-2 text-sm font-semibold"
                    style={{
                      borderColor: "rgba(34,197,94,0.18)",
                      background: "rgba(255,255,255,0.92)",
                      color: "#166534",
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:mt-10">
          {HERO_DETAILS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="hero-metric flex items-center gap-3 rounded-[24px] border px-4 py-4"
                style={{
                  borderColor: "rgba(34,197,94,0.12)",
                  background: "rgba(255,255,255,0.78)",
                  boxShadow: "0 14px 40px rgba(22,101,52,0.06)",
                }}
              >
                <span
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: "#DCFCE7", color: "#166534" }}
                >
                  <Icon size={20} />
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
