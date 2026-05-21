"use client";

import { useMemo, useRef } from "react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";

type TensorPhase = "impact" | "vibration" | "rotation";

type TensorFieldProps = {
  phase: TensorPhase;
};

type TensorCell = {
  id: string;
  x: number;
  y: number;
  z: number;
  translateX: number;
  translateY: number;
  scale: number;
  classes: string;
};

const PHASE_META: Record<
  TensorPhase,
  {
    eyebrow: string;
    title: string;
    detail: string;
    accent: string;
  }
> = {
  impact: {
    eyebrow: "Impact tensor",
    title: "Shock concentration",
    detail: "Peak energy clusters at the transfer event.",
    accent: "#F97316",
  },
  vibration: {
    eyebrow: "Vibration lattice",
    title: "3-axis oscillation field",
    detail: "Cross-plane motion compounds through handling transitions.",
    accent: "#B7FF5A",
  },
  rotation: {
    eyebrow: "Gyro tensor",
    title: "Rank-3 spatial rotation map",
    detail: "Rotational load resolves across x, y, and z simultaneously.",
    accent: "#7DD3FC",
  },
};

function buildCells(): TensorCell[] {
  const cells: TensorCell[] = [];

  for (let z = 0; z < 3; z += 1) {
    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        const offsetX = (x - 1) * 68 + (z - 1) * 26;
        const offsetY = (y - 1) * 54 - (z - 1) * 30;
        const classes = [
          `tensor-axis-x-${x}`,
          `tensor-axis-y-${y}`,
          `tensor-axis-z-${z}`,
          z === 2 ? "tensor-impact-cluster" : "",
          x === 1 || y === 1 || z === 1 ? "tensor-vibration-cross" : "",
          x === y || y === z ? "tensor-rotation-band" : "",
          x === 1 && y === 1 && z === 1 ? "tensor-core" : "",
        ]
          .filter(Boolean)
          .join(" ");

        cells.push({
          id: `${x}-${y}-${z}`,
          x,
          y,
          z,
          translateX: offsetX,
          translateY: offsetY,
          scale: 1 - z * 0.08,
          classes,
        });
      }
    }
  }

  return cells;
}

export default function TensorField({ phase }: TensorFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const meta = PHASE_META[phase];
  const cells = useMemo(() => buildCells(), []);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.set(".tensor-cell", {
        clearProps: "backgroundColor,boxShadow",
      });

      const accentTargets =
        phase === "impact"
          ? ".tensor-impact-cluster, .tensor-core"
          : phase === "vibration"
            ? ".tensor-vibration-cross, .tensor-core"
            : ".tensor-rotation-band, .tensor-core";

      const accentColor = meta.accent;

      const intro = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      intro
        .fromTo(
          ".tensor-cell",
          {
            autoAlpha: 0.22,
            scale: 0.7,
          },
          {
            autoAlpha: 0.9,
            scale: 1,
            stagger: {
              each: 0.01,
              from: "center",
            },
            duration: 0.42,
          },
        )
        .to(
          ".tensor-cell",
          {
            backgroundColor: "rgba(233, 242, 224, 0.08)",
            borderColor: "rgba(255,255,255,0.14)",
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            duration: 0.18,
          },
          0,
        )
        .to(
          accentTargets,
          {
            backgroundColor: accentColor,
            borderColor: accentColor,
            boxShadow: `0 0 34px ${accentColor}66`,
            scale: 1.15,
            stagger: 0.018,
            duration: 0.32,
          },
          0.08,
        )
        .fromTo(
          ".tensor-axis-line",
          {
            scaleX: 0,
            autoAlpha: 0.2,
          },
          {
            scaleX: 1,
            autoAlpha: 0.9,
            stagger: 0.06,
            transformOrigin: "left center",
            duration: 0.45,
          },
          0.12,
        )
        .fromTo(
          ".tensor-label",
          {
            autoAlpha: 0,
            y: 8,
          },
          {
            autoAlpha: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.26,
          },
          0.18,
        );

      gsap.to(".tensor-orbit-ring", {
        rotate: phase === "rotation" ? 360 : 0,
        duration: phase === "rotation" ? 8 : 0.3,
        repeat: phase === "rotation" ? -1 : 0,
        ease: "none",
      });
    },
    { scope: rootRef, dependencies: [phase, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <div
      ref={rootRef}
      className="relative h-[320px] overflow-hidden rounded-[32px] border"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(9,13,11,0.96) 0%, rgba(4,7,6,0.98) 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.78), rgba(0,0,0,0.12))",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div>
          <p
            className="tensor-label text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: meta.accent }}
          >
            {meta.eyebrow}
          </p>
          <p
            data-display="true"
            className="tensor-label mt-3 max-w-[260px] text-xl font-semibold tracking-[-0.04em]"
          >
            {meta.title}
          </p>
          <p
            className="tensor-label mt-3 max-w-[280px] text-sm leading-relaxed text-white/58"
          >
            {meta.detail}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="relative h-[246px] w-[280px]"
            style={{ perspective: "1100px" }}
            aria-hidden="true"
          >
            <div
              className="tensor-orbit-ring absolute left-1/2 top-1/2 h-[174px] w-[174px] -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                borderColor:
                  phase === "rotation"
                    ? "rgba(125,211,252,0.28)"
                    : "rgba(183,255,90,0.16)",
              }}
            />
            <div
              className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background:
                  phase === "rotation"
                    ? "radial-gradient(circle, rgba(125,211,252,0.18) 0%, rgba(125,211,252,0.02) 72%)"
                    : "radial-gradient(circle, rgba(183,255,90,0.18) 0%, rgba(183,255,90,0.02) 72%)",
              }}
            />

            <span
              className="tensor-axis-line absolute left-[70px] top-[160px] h-px w-[126px]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.28) 100%)",
              }}
            />
            <span
              className="tensor-axis-line absolute left-[140px] top-[144px] h-[92px] w-px"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.28) 100%)",
              }}
            />
            <span
              className="tensor-axis-line absolute left-[142px] top-[86px] h-px w-[92px] -rotate-[50deg]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.28) 100%)",
              }}
            />

            {cells.map((cell) => (
              <span
                key={cell.id}
                className={`tensor-cell absolute h-4 w-4 rounded-[6px] border ${cell.classes}`}
                style={{
                  left: "50%",
                  top: "50%",
                  background: "rgba(233,242,224,0.06)",
                  borderColor: "rgba(255,255,255,0.12)",
                  transform: `translate(-50%, -50%) translate(${cell.translateX}px, ${cell.translateY}px) scale(${cell.scale})`,
                }}
              />
            ))}

            <span className="tensor-label absolute bottom-[18px] left-[44px] text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
              X
            </span>
            <span className="tensor-label absolute bottom-[98px] left-[144px] text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
              Y
            </span>
            <span className="tensor-label absolute right-[32px] top-[74px] text-[10px] font-semibold uppercase tracking-[0.28em] text-white/55">
              Z
            </span>
          </div>
        </div>

        <div className="relative z-10 grid gap-3 border-t border-white/8 pt-4 sm:grid-cols-2">
          <div className="tensor-label rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">
              Spatial Orientation
            </p>
            <p className="telemetry-mono mt-2 text-[11px] text-white/68">
              3x3x3 Rank-3 Tensor Field
            </p>
          </div>
          <div className="tensor-label rounded-[18px] border border-white/8 bg-white/[0.03] px-3 py-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/34">
              Telemetry
            </p>
            <p className="telemetry-mono mt-2 text-[11px] text-white/68">
              Gyroscopic Precision Map
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
