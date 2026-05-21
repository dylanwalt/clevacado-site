"use client";

import { useRef } from "react";
import Image from "next/image";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import explodedRender from "@/public/assets/clevacado-exploded-3d.png";

const LAYERS = [
  {
    label: "Outer shell",
    detail: "Protective body designed for handling flows.",
    position: "left-[4%] top-[12%]",
  },
  {
    label: "Sensor core",
    detail: "Inertial sensing that captures shocks and motion.",
    position: "right-[2%] top-[28%]",
  },
  {
    label: "Power layer",
    detail: "Compact battery stack for full diagnostic runs.",
    position: "left-[8%] bottom-[20%]",
  },
  {
    label: "Data layer",
    detail: "Signals translated into stage-by-stage risk.",
    position: "right-[4%] bottom-[8%]",
  },
] as const;

const SIGNAL_CHIPS = ["Impact", "Vibration", "Rotation"] as const;

export default function ExplodedSensorDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);
  const signalPathRef = useRef<SVGPathElement>(null);
  const corePulseRef = useRef<SVGCircleElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const signalPath = signalPathRef.current;

      if (signalPath) {
        const pathLength = signalPath.getTotalLength();
        gsap.set(signalPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: prefersReducedMotion ? 0 : pathLength,
        });
      }

      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });

      reveal
        .from(".exploded-stage", {
          autoAlpha: 0,
          y: 26,
          scale: 0.97,
          duration: 0.9,
          ease: "power3.out",
        })
        .from(
          ".exploded-label",
          {
            autoAlpha: 0,
            x: 18,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.12,
          },
          0.18,
        )
        .from(
          ".exploded-chip",
          {
            autoAlpha: 0,
            y: 14,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.08,
          },
          0.24,
        );

      if (signalPath) {
        reveal.to(
          signalPath,
          {
            strokeDashoffset: 0,
            duration: 1,
            ease: "power2.out",
          },
          0.22,
        );
      }

      if (prefersReducedMotion) return;

      gsap.to(".exploded-float", {
        y: -10,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".exploded-chip", {
        y: -6,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        stagger: 0.14,
        ease: "sine.inOut",
      });

      if (corePulseRef.current) {
        gsap.to(corePulseRef.current, {
          attr: { r: 16 },
          opacity: 0.08,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-[38px] border px-5 py-6 sm:px-6 sm:py-8"
      style={{
        borderColor: "rgba(47,143,70,0.15)",
        background:
          "linear-gradient(180deg, rgba(255,253,247,0.98) 0%, rgba(250,248,239,0.98) 100%)",
        boxShadow: "0 24px 70px rgba(23,77,42,0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 28%, rgba(183,255,90,0.18), transparent 46%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at center, rgba(23,77,42,0.03) 0 1px, transparent 1px 28px)",
        }}
        aria-hidden="true"
      />

      <div className="relative">
        <svg
          className="pointer-events-none absolute inset-0 hidden h-full w-full xl:block"
          viewBox="0 0 700 620"
          fill="none"
          aria-hidden="true"
        >
          <path
            ref={signalPathRef}
            d="M348 102V188M348 188C348 208 338 224 320 240M348 188C348 208 360 224 378 238M320 240V402M378 238V426M348 402V520"
            stroke="#5ED143"
            strokeOpacity="0.54"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle ref={corePulseRef} cx="348" cy="188" r="10" fill="#B7FF5A" fillOpacity="0.28" />
          <circle cx="320" cy="240" r="7" fill="#F6B73C" fillOpacity="0.3" />
          <circle cx="378" cy="238" r="7" fill="#F97316" fillOpacity="0.3" />
          <circle cx="348" cy="520" r="7" fill="#5ED143" fillOpacity="0.26" />
        </svg>

        <div className="relative mx-auto max-w-[660px]">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[270px] w-[270px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(183,255,90,0.22) 0%, rgba(94,209,67,0.08) 42%, rgba(255,255,255,0) 72%)",
            }}
            aria-hidden="true"
          />

          <div className="exploded-stage exploded-float relative z-[1]">
            <Image
              src={explodedRender}
              alt="Exploded ClevaCado product render showing shell, power, and sensing layers"
              sizes="(min-width: 1280px) 36vw, 88vw"
              className="mx-auto w-full object-contain drop-shadow-[0_30px_70px_rgba(23,77,42,0.16)]"
            />
          </div>

          {LAYERS.map((layer) => (
            <div
              key={layer.label}
              className={`exploded-label absolute z-10 hidden max-w-[230px] rounded-[24px] border px-4 py-3 xl:block ${layer.position}`}
              style={{
                borderColor: "rgba(47,143,70,0.14)",
                background: "rgba(255,253,247,0.92)",
                boxShadow: "0 16px 40px rgba(23,77,42,0.06)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#2F8F46" }}>
                {layer.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#5E6B61" }}>
                {layer.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:hidden">
          {LAYERS.map((layer) => (
            <div
              key={layer.label}
              className="rounded-[22px] border px-4 py-4"
              style={{
                borderColor: "rgba(47,143,70,0.14)",
                background: "rgba(255,253,247,0.92)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#2F8F46" }}>
                {layer.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#5E6B61" }}>
                {layer.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {SIGNAL_CHIPS.map((item) => (
            <span
              key={item}
              className="exploded-chip rounded-full border px-4 py-2 text-sm font-semibold"
              style={{
                borderColor: "rgba(47,143,70,0.12)",
                background: "rgba(255,253,247,0.92)",
                color: "#174D2A",
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
