"use client";

import { useRef } from "react";
import Image from "next/image";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import explodedRender from "@/public/assets/clevacado-exploded-3d.png";

const LAYERS = [
  {
    label: "Outer shell",
    detail: "Protective avocado shell built to move through handling flows.",
    position: "left-[4%] top-[12%]",
  },
  {
    label: "Sensor core",
    detail: "Accelerometer and gyroscope package measuring shocks and motion.",
    position: "right-[2%] top-[28%]",
  },
  {
    label: "Power layer",
    detail: "Compact battery stack sized for full diagnostic runs.",
    position: "left-[8%] bottom-[20%]",
  },
  {
    label: "Data layer",
    detail: "Motion signals translated into stage-by-stage risk intelligence.",
    position: "right-[4%] bottom-[8%]",
  },
] as const;

export default function ExplodedSensorDiagram() {
  const rootRef = useRef<HTMLDivElement>(null);
  const signalPathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const signalPath = signalPathRef.current;

      if (signalPath) {
        const pathLength = signalPath.getTotalLength();
        gsap.set(signalPath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
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
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.12,
          },
          0.2,
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

      if (!prefersReducedMotion) {
        gsap.to(".exploded-float", {
          y: -10,
          duration: 4.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(".exploded-chip", {
          y: -6,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          stagger: 0.18,
          ease: "sine.inOut",
        });
      }
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-[36px] border px-5 py-6 sm:px-6 sm:py-8"
      style={{
        borderColor: "rgba(34,197,94,0.15)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
        boxShadow: "0 24px 70px rgba(22,101,52,0.08)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 28%, rgba(57,211,83,0.15), transparent 45%)",
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
            d="M348 106V190M348 190C348 208 338 224 320 240M348 190C348 208 360 225 378 238M320 240V402M378 238V426M348 402V522"
            stroke="#39D353"
            strokeOpacity="0.48"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="348" cy="106" r="7" fill="#39D353" fillOpacity="0.26" />
          <circle cx="320" cy="240" r="7" fill="#FACC15" fillOpacity="0.3" />
          <circle cx="378" cy="238" r="7" fill="#FB923C" fillOpacity="0.3" />
          <circle cx="348" cy="522" r="7" fill="#39D353" fillOpacity="0.26" />
        </svg>

        <div className="relative mx-auto max-w-[660px]">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(57,211,83,0.24) 0%, rgba(255,255,255,0) 72%)",
            }}
            aria-hidden="true"
          />
          <div className="exploded-stage exploded-float relative z-[1]">
            <Image
              src={explodedRender}
              alt="Exploded ClevaCado product render showing shell, power, and sensing layers"
              sizes="(min-width: 1280px) 36vw, 88vw"
              className="mx-auto w-full object-contain drop-shadow-[0_30px_70px_rgba(22,101,52,0.16)]"
            />
          </div>

          {LAYERS.map((layer) => (
            <div
              key={layer.label}
              className={`exploded-label exploded-chip absolute z-10 hidden max-w-[230px] rounded-[24px] border px-4 py-3 xl:block ${layer.position}`}
              style={{
                borderColor: "rgba(34,197,94,0.16)",
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 16px 40px rgba(22,101,52,0.08)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {layer.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
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
                borderColor: "rgba(34,197,94,0.14)",
                background: "rgba(255,255,255,0.92)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {layer.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {layer.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {["Impact", "Vibration", "Rotation", "Risk profile"].map((item) => (
            <span
              key={item}
              className="rounded-full border px-4 py-2 text-sm font-semibold text-slate-700"
              style={{
                borderColor: "rgba(34,197,94,0.12)",
                background: "rgba(255,255,255,0.92)",
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
