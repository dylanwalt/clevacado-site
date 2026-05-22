"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CircleGauge,
  Cpu,
  Database,
  Factory,
  Leaf,
  Package,
  ScanLine,
  Truck,
} from "lucide-react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import {
  CONTACT_EMAIL,
  DASHBOARD_CHART_DATA,
  JOURNEY_STAGES,
  RISK_META,
} from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import heroDevice from "@/public/assets/clevacado-hero-3d.png";
import explodedDevice from "@/public/assets/clevacado-exploded-3d.png";
import blueprintImage from "@/public/assets/blueprint-image.png";
import homeSceneLogo from "@/public/branding/home-scene-mark.png";
import BrandLogo from "./BrandLogo";

type TechLayer = {
  id: string;
  label: string;
  title: string;
  detail: string;
  clipPath: string;
  y: number;
};

type PipelineFrame = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  signal: string;
  action: string;
  accent: string;
  Icon: typeof Leaf;
};

const HERO_CHIPS = [
  { label: "Impact detected", value: "2.1 g", className: "left-[4%] top-[22%]" },
  { label: "Vibration mapped", value: "22 min", className: "right-[8%] top-[20%]" },
  { label: "Hotspot found", value: "Sorting", className: "right-[12%] bottom-[18%]" },
] as const;

const TECH_LAYERS: TechLayer[] = [
  {
    id: "shell",
    label: "Layer 01",
    title: "Shell",
    detail: "Impact housing built to stay in the handling flow.",
    clipPath: "inset(0% 0% 61% 0%)",
    y: -120,
  },
  {
    id: "sensor-core",
    label: "Layer 02",
    title: "Sensor core",
    detail: "Inertial capture records shock, vibration, and orientation.",
    clipPath: "inset(24% 0% 33% 0%)",
    y: -38,
  },
  {
    id: "power",
    label: "Layer 03",
    title: "Power",
    detail: "Energy reserve sustains diagnostic runs through the chain.",
    clipPath: "inset(56% 0% 18% 0%)",
    y: 52,
  },
  {
    id: "data",
    label: "Layer 04",
    title: "Data layer",
    detail: "Telemetry resolves into stage-level handling intelligence.",
    clipPath: "inset(70% 0% 0% 0%)",
    y: 142,
  },
] as const;

const PIPELINE_FRAMES: PipelineFrame[] = [
  {
    id: "harvest",
    label: "Harvest",
    eyebrow: "Field telemetry",
    title: "Early knocks start the hidden loss.",
    signal: "Detected: 2.1g picking impact.",
    action: "Action: tighten first-touch handling.",
    accent: "#B7FF5A",
    Icon: Leaf,
  },
  {
    id: "bins",
    label: "Bins",
    eyebrow: "Transfer telemetry",
    title:
      "Bin transfers stack up the damage. Tipping and stacking introduce repeated mechanical stress before sorting even begins.",
    signal: "Detected: 3.1g bin shock.",
    action: "Action: soften drop interfaces.",
    accent: "#F6B73C",
    Icon: Package,
  },
  {
    id: "sorting",
    label: "Sorting",
    eyebrow: "Packhouse telemetry",
    title: "The transfer line becomes the hotspot.",
    signal: "Detected: shock spike at 10:45.",
    action: "Action: reduce conveyor handoff height.",
    accent: "#F97316",
    Icon: Factory,
  },
  {
    id: "transport",
    label: "Transport",
    eyebrow: "Route telemetry",
    title: "Long vibration keeps loading the fruit.",
    signal: "Detected: 22 minutes above target.",
    action: "Action: review route isolation points.",
    accent: "#7DD3FC",
    Icon: Truck,
  },
  {
    id: "report",
    label: "Report",
    eyebrow: "Diagnostic answer",
    title: "The fix becomes obvious.",
    signal: "Hotspot: packhouse transfer line.",
    action: "Action: adjust process and rerun.",
    accent: "#5ED143",
    Icon: BarChart3,
  },
] as const;

const TELEMETRY_CLASS = "telemetry-mono text-white/72";

function buildPlot(points: ReadonlyArray<{ time: string; impact: number; vibration: number }>, key: "impact" | "vibration") {
  const width = 460;
  const height = 180;
  const padding = 12;
  const maxValue = 5;

  return points
    .map((point, index) => {
      const x =
        padding +
        (index / (points.length - 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        (point[key] / maxValue) * (height - padding * 2);

      return `${x},${y}`;
    })
    .join(" ");
}

function buildArea(points: string) {
  const [first] = points.split(" ");
  const last = points.split(" ").at(-1);
  if (!first || !last) return "";

  const [, firstY] = first.split(",");
  const [lastX] = last.split(",");

  return `${points} ${lastX},168 12,168 12,${firstY}`;
}

function ScenePanel({ frame, index }: { frame: PipelineFrame; index: number }) {
  const Icon = frame.Icon;

  return (
    <div className="relative h-full w-screen shrink-0 overflow-hidden px-6 py-14">
      <div
        className="absolute inset-0"
        style={{
          background:
            index === 0
              ? "radial-gradient(circle at 24% 30%, rgba(183,255,90,0.14), transparent 28%), linear-gradient(135deg, #081109 0%, #101c10 52%, #060907 100%)"
              : index === 1
                ? "radial-gradient(circle at 64% 26%, rgba(246,183,60,0.18), transparent 24%), linear-gradient(135deg, #07100a 0%, #16140c 52%, #060907 100%)"
                : index === 2
                  ? "radial-gradient(circle at 74% 40%, rgba(249,115,22,0.2), transparent 26%), linear-gradient(135deg, #05070a 0%, #17110c 52%, #050607 100%)"
                  : index === 3
                    ? "radial-gradient(circle at 30% 20%, rgba(125,211,252,0.16), transparent 24%), linear-gradient(135deg, #04080b 0%, #0a1318 48%, #050607 100%)"
                    : "radial-gradient(circle at 50% 24%, rgba(94,209,67,0.16), transparent 24%), linear-gradient(135deg, #05070a 0%, #0f1510 42%, #040506 100%)",
        }}
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(circle at center, rgba(0,0,0,0.92), rgba(0,0,0,0.24))",
        }}
        aria-hidden="true"
      />

      <div
        className="pipeline-ambient absolute left-[8%] top-[14%] h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${frame.accent}1a 0%, transparent 70%)`,
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <Icon
          strokeWidth={1.15}
          className="pipeline-ambient h-[44vh] w-[44vh] text-white/[0.05]"
        />
      </div>

      <div className="absolute bottom-[12%] right-[7%]">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: frame.accent, boxShadow: `0 0 20px ${frame.accent}` }}
        />
      </div>

      {index === 0 && (
        <div className="absolute bottom-[16%] left-[20%] h-[120px] w-[260px] rounded-[42px] border border-white/6 bg-white/[0.02] backdrop-blur-[2px]" />
      )}
      {index === 1 && (
        <>
          <div className="absolute bottom-[18%] left-[18%] h-[90px] w-[180px] rounded-[28px] border border-white/8 bg-white/[0.03]" />
          <div className="absolute bottom-[26%] left-[28%] h-[90px] w-[180px] rounded-[28px] border border-white/8 bg-white/[0.03]" />
        </>
      )}
      {index === 2 && (
        <>
          <div className="absolute left-[16%] top-[56%] h-px w-[42%] -rotate-6 bg-white/15" />
          <div className="absolute left-[38%] top-[48%] h-px w-[36%] rotate-2 bg-white/15" />
          <div
            className="absolute left-[54%] top-[44%] h-14 w-14 rounded-full border"
            style={{ borderColor: `${frame.accent}88`, boxShadow: `0 0 42px ${frame.accent}44` }}
          />
        </>
      )}
      {index === 3 && (
        <>
          <div className="absolute left-[12%] top-[52%] h-px w-[52%] bg-white/10" />
          <div className="absolute left-[12%] top-[58%] h-px w-[66%] bg-white/8" />
          <div className="absolute left-[12%] top-[64%] h-px w-[46%] bg-white/8" />
        </>
      )}
      {index === 4 && (
        <>
          <div className="absolute left-[18%] top-[34%] grid grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, cellIndex) => (
              <span
                key={cellIndex}
                className="h-3.5 w-3.5 rounded-[5px]"
                style={{
                  background:
                    cellIndex === 7 ? "#F97316" : "rgba(255,255,255,0.18)",
                  boxShadow:
                    cellIndex === 7
                      ? "0 0 28px rgba(249,115,22,0.5)"
                      : "none",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function CinematicPitch() {
  const rootRef = useRef<HTMLDivElement>(null);
  const hookSceneRef = useRef<HTMLElement>(null);
  const hookStageRef = useRef<HTMLDivElement>(null);
  const heroSceneRef = useRef<HTMLElement>(null);
  const heroStageRef = useRef<HTMLDivElement>(null);
  const techSceneRef = useRef<HTMLElement>(null);
  const techStageRef = useRef<HTMLDivElement>(null);
  const journeySceneRef = useRef<HTMLElement>(null);
  const journeyStageRef = useRef<HTMLDivElement>(null);
  const analyticsSceneRef = useRef<HTMLElement>(null);
  const analyticsStageRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLParagraphElement>(null);
  const [activeTechLayer, setActiveTechLayer] = useState(0);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeTech = TECH_LAYERS[activeTechLayer];
  const activeFrame = PIPELINE_FRAMES[activeFrameIndex];
  const impactPolyline = useMemo(
    () => buildPlot(DASHBOARD_CHART_DATA, "impact"),
    [],
  );
  const impactArea = useMemo(() => buildArea(impactPolyline), [impactPolyline]);

  useGSAP(
    () => {
      if (scoreRef.current) {
        scoreRef.current.textContent = prefersReducedMotion ? "72" : "0";
      }

      const mm = gsap.matchMedia();

      if (!prefersReducedMotion) {
        gsap
          .timeline({
            defaults: { ease: "power2.out" },
          })
          .fromTo(
            ".hook-copy",
            {
              autoAlpha: 0,
              y: 24,
            },
            {
              autoAlpha: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.72,
            },
          )
          .fromTo(
            ".hook-silhouette",
            {
              autoAlpha: 0,
              scale: 0.94,
            },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.96,
              ease: "power3.out",
            },
            0.04,
          )
          .fromTo(
            ".hook-ring",
            {
              autoAlpha: 0,
              scale: 0.9,
            },
            {
              autoAlpha: 1,
              scale: 1,
              stagger: 0.05,
              duration: 0.48,
            },
            0.14,
          )
          .fromTo(
            ".hook-dot",
            {
              autoAlpha: 0,
              scale: 0.4,
            },
            {
              autoAlpha: 1,
              scale: 1,
              stagger: 0.04,
              duration: 0.34,
            },
            0.2,
          )
          .fromTo(
            ".hook-scroll-indicator",
            {
              autoAlpha: 0,
              y: 10,
            },
            {
              autoAlpha: 0.82,
              y: 0,
              duration: 0.42,
            },
            0.42,
          );

        gsap.to(".hook-scroll-line", {
          scaleY: 1.16,
          opacity: 1,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          transformOrigin: "center top",
        });
      }

      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>(".mobile-reveal").forEach((element) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: 28,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        });
      });

      if (prefersReducedMotion) {
        return () => mm.revert();
      }

      mm.add("(min-width: 1024px)", () => {
        const hookTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: hookSceneRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: hookStageRef.current,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        hookTimeline
          .to(
            ".hook-beam",
            {
              y: 360,
              duration: 1,
              ease: "none",
            },
            0,
          )
          .to(
            ".hook-scroll-indicator",
            {
              autoAlpha: 0,
              y: 18,
              duration: 0.28,
              ease: "none",
            },
            0.04,
          )
          .to(
            ".hook-copy",
            {
              yPercent: -26,
              autoAlpha: 0.08,
              duration: 1,
              ease: "none",
            },
            0.28,
          )
          .to(
            ".hook-silhouette",
            {
              scale: 1.08,
              autoAlpha: 0.24,
              duration: 1,
              ease: "none",
            },
            0.24,
          )
          .to(
            ".hook-ring",
            {
              scale: 1.06,
              autoAlpha: 0.18,
              stagger: 0.04,
              duration: 0.8,
              ease: "none",
            },
            0.16,
          )
          .to(
            ".hook-dot",
            {
              autoAlpha: 0.24,
              y: 18,
              stagger: 0.03,
              duration: 0.74,
              ease: "none",
            },
            0.22,
          );

        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroSceneRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: heroStageRef.current,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        heroTimeline
          .from(".hero-copy", {
            autoAlpha: 0,
            y: 32,
            stagger: 0.08,
            duration: 0.8,
            ease: "power2.out",
          })
          .from(
            ".hero-glow",
            {
              autoAlpha: 0,
              scale: 0.72,
              duration: 1.1,
            },
            0.06,
          )
          .from(
            ".hero-device",
            {
              autoAlpha: 0,
              y: 180,
              scale: 0.72,
              rotate: -6,
              duration: 1.3,
              ease: "power3.out",
            },
            0.1,
          )
          .from(
            ".hero-chip",
            {
              autoAlpha: 0,
              y: 18,
              stagger: 0.08,
              duration: 0.42,
            },
            0.22,
          )
          .to(
            ".hero-device",
            {
              y: -54,
              scale: 1.08,
              duration: 1,
              ease: "none",
            },
            0.46,
          )
          .to(
            ".hero-parallax-slow",
            {
              yPercent: -12,
              duration: 1,
              ease: "none",
            },
            0.42,
          )
          .to(
            ".hero-parallax-fast",
            {
              yPercent: -24,
              duration: 1,
              ease: "none",
            },
            0.42,
          )
          .to(
            ".hero-assembled",
            {
              autoAlpha: 0,
              duration: 0.5,
              ease: "power2.inOut",
            },
            0.66,
          )
          .to(
            ".hero-exploded",
            {
              autoAlpha: 1,
              duration: 0.5,
              ease: "power2.inOut",
            },
            0.66,
          );

        const techTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: techSceneRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: techStageRef.current,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextIndex = Math.min(
                TECH_LAYERS.length - 1,
                Math.floor(self.progress * TECH_LAYERS.length),
              );
              setActiveTechLayer((current) =>
                current === nextIndex ? current : nextIndex,
              );
            },
          },
        });

        techTimeline
          .from(".tech-copy", {
            autoAlpha: 0,
            y: 24,
            stagger: 0.08,
            duration: 0.65,
            ease: "power2.out",
          })
          .from(
            ".tech-shell-base",
            {
              autoAlpha: 0,
              scale: 0.9,
              duration: 1,
              ease: "power2.out",
            },
            0.08,
          )
          .from(
            ".tech-label",
            {
              autoAlpha: 0,
              x: 20,
              stagger: 0.06,
              duration: 0.4,
            },
            0.2,
          )
          .to(".tech-layer-shell", { y: TECH_LAYERS[0].y, duration: 1 }, 0.3)
          .to(".tech-layer-sensor-core", { y: TECH_LAYERS[1].y, duration: 1 }, 0.42)
          .to(".tech-layer-power", { y: TECH_LAYERS[2].y, duration: 1 }, 0.54)
          .to(".tech-layer-data", { y: TECH_LAYERS[3].y, duration: 1 }, 0.66)
          .to(
            ".tech-connector",
            {
              scaleX: 1,
              autoAlpha: 1,
              stagger: 0.08,
              transformOrigin: "left center",
              duration: 0.46,
            },
            0.28,
          )
          .to(
            ".tech-copy",
            {
              autoAlpha: 0.18,
              yPercent: -8,
              duration: 1,
              ease: "none",
            },
            0.56,
          );

        const journeyTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: journeySceneRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: journeyStageRef.current,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextIndex = Math.min(
                PIPELINE_FRAMES.length - 1,
                Math.floor(self.progress * PIPELINE_FRAMES.length),
              );
              setActiveFrameIndex((current) =>
                current === nextIndex ? current : nextIndex,
              );
            },
          },
        });

        journeyTimeline
          .from(".journey-copy", {
            autoAlpha: 0,
            y: 28,
            stagger: 0.08,
            duration: 0.65,
            ease: "power2.out",
          })
          .to(
            ".pipeline-track",
            {
              x: () => -(window.innerWidth * (PIPELINE_FRAMES.length - 1)),
              duration: 1,
              ease: "none",
            },
            0,
          )
          .to(
            ".pipeline-device",
            {
              scale: 1.06,
              yPercent: -8,
              duration: 1,
              ease: "none",
            },
            0.14,
          )
          .to(
            ".pipeline-grid-far",
            {
              yPercent: -14,
              duration: 1,
              ease: "none",
            },
            0.04,
          )
          .to(
            ".pipeline-grid-near",
            {
              yPercent: -22,
              duration: 1,
              ease: "none",
            },
            0.04,
          )
          .to(
            ".pipeline-overlay-card",
            {
              yPercent: -6,
              duration: 1,
              ease: "none",
            },
            0.12,
          )
          .to(
            ".journey-copy",
            {
              autoAlpha: 0.14,
              yPercent: -10,
              duration: 1,
              ease: "none",
            },
            0.3,
          );

        const analyticsTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: analyticsSceneRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: analyticsStageRef.current,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (scoreRef.current) {
                const nextValue = Math.round(Math.min(72, self.progress * 92));
                scoreRef.current.textContent = String(nextValue);
              }
            },
          },
        });

        analyticsTimeline
          .from(".analytics-copy, .analytics-stat-cards", {
            autoAlpha: 0,
            y: 22,
            stagger: 0.08,
            duration: 0.7,
            ease: "power2.out",
          })
          .from(
            ".analytics-panel",
            {
              autoAlpha: 0,
              y: 28,
              stagger: 0.08,
              duration: 0.7,
              ease: "power2.out",
            },
            0.12,
          )
          .from(
            ".analytics-row",
            {
              autoAlpha: 0,
              x: 22,
              stagger: 0.05,
              duration: 0.36,
            },
            0.28,
          )
          .from(
            ".analytics-plot-line",
            {
              strokeDashoffset: 1200,
              duration: 0.95,
            },
            0.34,
          )
          .from(
            ".analytics-plot-fill",
            {
              autoAlpha: 0,
              duration: 0.4,
            },
            0.42,
          )
          .to(
            ".analytics-copy",
            {
              autoAlpha: 0.18,
              yPercent: -6,
              duration: 1,
              ease: "none",
            },
            0.52,
          );

        return () => {
          hookTimeline.kill();
          heroTimeline.kill();
          techTimeline.kill();
          journeyTimeline.kill();
          analyticsTimeline.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap.to(".tech-layer", {
        opacity: 0.44,
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(`.tech-layer-${activeTech.id}`, {
        opacity: 1,
        duration: 0.36,
        ease: "power2.out",
        overwrite: "auto",
      });

      TECH_LAYERS.forEach((layer, index) => {
        gsap.set(`.tech-layer-${layer.id}`, {
          zIndex: activeTech.id === layer.id ? 12 : TECH_LAYERS.length - index,
        });
      });

      gsap.fromTo(
        ".live-copy",
        { autoAlpha: 0.16, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out" },
      );
    },
    {
      scope: rootRef,
      dependencies: [activeTechLayer, activeFrameIndex, prefersReducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={rootRef} className="relative overflow-x-hidden bg-[#040606] text-[#F6F7F2]">
      <div
        className="pointer-events-none fixed inset-0 z-[-2]"
        style={{
          background:
            "radial-gradient(circle at top, rgba(94,209,67,0.10), transparent 24%), radial-gradient(circle at 78% 18%, rgba(183,255,90,0.08), transparent 22%), linear-gradient(180deg, #070908 0%, #040606 50%, #060907 100%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-[-1] opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.22))",
        }}
      />

      <section
        id="problem"
        ref={hookSceneRef}
        className="relative lg:h-[190vh]"
      >
        <div
          ref={hookStageRef}
          className="relative flex min-h-screen items-center overflow-hidden px-6 py-24 lg:h-screen lg:py-28"
        >
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="mobile-reveal max-w-[620px]">
              <p className="hook-copy text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B7FF5A]">
                Problem
              </p>
              <h1
                data-display="true"
                className="hook-copy mt-6 max-w-[640px] text-balance text-[clamp(3.4rem,7vw,7.6rem)] font-semibold leading-[0.88] tracking-[-0.07em]"
              >
                Avocado bruising is invisible until it is too late.
              </h1>
              <p className="hook-copy mt-6 max-w-[520px] text-lg leading-relaxed text-white/58 sm:text-xl">
                By the time the bruise shows, the handling data is gone.
              </p>
            </div>

            <div className="mobile-reveal relative flex min-h-[520px] items-center justify-center lg:justify-end">
              <div
                className="hook-silhouette relative flex w-full max-w-[760px] items-center justify-center"
                style={{
                  filter: "drop-shadow(0 54px 120px rgba(0,0,0,0.45))",
                }}
              >
                <div className="absolute right-[2%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#B7FF5A]/10 blur-3xl sm:h-[520px] sm:w-[520px]" />
                <div className="hook-ring absolute right-[6%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-white/8 sm:h-[620px] sm:w-[620px]" />
                <div className="hook-ring absolute right-[12%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full border border-white/6 sm:h-[520px] sm:w-[520px]" />
                <div className="hook-ring absolute right-[18%] top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full border border-white/5 sm:h-[410px] sm:w-[410px]" />
                <div
                  className="hook-beam absolute left-[26%] right-[8%] top-1/2 h-[2px] -translate-y-1/2"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(183,255,90,0) 0%, rgba(183,255,90,0.9) 20%, rgba(183,255,90,1) 50%, rgba(183,255,90,0.9) 80%, rgba(183,255,90,0) 100%)",
                    boxShadow: "0 0 20px rgba(183,255,90,0.55)",
                  }}
                />
                {[
                  "right-[35%] top-[28%]",
                  "right-[16%] top-[40%]",
                  "right-[30%] top-[60%]",
                  "right-[44%] top-[72%]",
                ].map((position) => (
                  <span
                    key={position}
                    className={`hook-dot absolute h-3.5 w-3.5 rounded-full ${position}`}
                    style={{
                      background: "rgba(246,183,60,0.95)",
                      boxShadow: "0 0 20px rgba(249,115,22,0.55)",
                    }}
                  />
                ))}
                <div
                  className="absolute right-[6%] top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 36%, rgba(183,255,90,0.08), transparent 28%), radial-gradient(circle at 48% 64%, rgba(249,115,22,0.08), transparent 24%)",
                  }}
                />
                <div className="relative z-10 ml-auto flex w-full max-w-[620px] flex-col items-end justify-center sm:max-w-[680px]">
                  <Image
                    src={homeSceneLogo}
                    alt="ClevaCado logo mark"
                    priority
                    sizes="(min-width: 1024px) 32vw, 70vw"
                    className="w-full max-w-[500px] object-contain"
                  />
                  <div className="mt-3 pr-6 text-right">
                    <p
                      data-display="true"
                      className="text-[clamp(2.8rem,5vw,5.6rem)] font-semibold tracking-[-0.08em] text-white"
                    >
                      ClevaCado
                    </p>
                    <p className="telemetry-mono mt-2 text-[11px] uppercase tracking-[0.28em] text-white/36">
                      Post-harvest diagnostics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hook-scroll-indicator pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/34">
              Scroll
            </span>
            <span className="relative h-16 w-px overflow-hidden rounded-full bg-white/10">
              <span className="hook-scroll-line absolute inset-x-0 top-0 h-8 rounded-full bg-[#B7FF5A] opacity-80 shadow-[0_0_14px_rgba(183,255,90,0.6)]" />
            </span>
          </div>
        </div>
      </section>

      <section
        id="device"
        ref={heroSceneRef}
        className="relative lg:h-[250vh]"
      >
        <div
          ref={heroStageRef}
          className="relative flex min-h-screen items-center overflow-hidden px-6 py-24 lg:h-screen lg:py-28"
        >
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[0.84fr_1.16fr]">
            <div className="mobile-reveal max-w-[520px]">
              <p className="hero-copy text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B7FF5A]">
                The device
              </p>
              <h2
                data-display="true"
                className="hero-copy mt-6 max-w-[560px] text-balance text-[clamp(3rem,6vw,6.6rem)] font-semibold leading-[0.9] tracking-[-0.07em]"
              >
                ClevaCado enters the chain with the fruit.
              </h2>
              <p className="hero-copy mt-6 max-w-[500px] text-lg leading-relaxed text-white/58">
                One diagnostic device. Continuous telemetry. No guesswork.
              </p>
            </div>

            <div className="mobile-reveal relative flex min-h-[580px] items-center justify-center">
              <div
                className="hero-glow hero-parallax-slow absolute h-[520px] w-[520px] rounded-full blur-3xl sm:h-[640px] sm:w-[640px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(183,255,90,0.24) 0%, rgba(94,209,67,0.12) 34%, rgba(94,209,67,0.02) 72%)",
                }}
              />
              <div className="hero-parallax-slow absolute h-[620px] w-[620px] rounded-full border border-white/6" />
              <div className="hero-parallax-slow absolute h-[460px] w-[460px] rounded-full border border-white/8" />
              <div className="hero-parallax-fast absolute h-[300px] w-[300px] rounded-full border border-white/10" />

              {HERO_CHIPS.map((chip) => (
                <div
                  key={chip.label}
                  className={`hero-chip hero-parallax-fast absolute hidden min-w-[164px] rounded-[22px] border border-white/10 bg-black/48 px-4 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.24)] backdrop-blur-md md:block ${chip.className}`}
                >
                  <p className="telemetry-mono text-[11px] uppercase text-white/46">
                    {chip.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white/84">
                    {chip.value}
                  </p>
                </div>
              ))}

              <div className="hero-device relative z-10 w-full max-w-[620px]">
                <div
                  className="relative overflow-hidden rounded-[44px] border border-white/8 shadow-[0_50px_120px_rgba(0,0,0,0.34)]"
                >
                  {/* Assembled — light card, fades out mid-scroll */}
                  <div
                    className="hero-assembled p-4"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 22%, rgba(183,255,90,0.26) 0%, rgba(246,247,242,0.98) 34%, rgba(221,230,214,0.92) 100%)",
                    }}
                  >
                    <Image
                      src={heroDevice}
                      alt="ClevaCado device"
                      priority
                      sizes="(min-width: 1024px) 44vw, 88vw"
                      className="mx-auto w-full object-contain drop-shadow-[0_50px_120px_rgba(0,0,0,0.42)]"
                    />
                  </div>
                  {/* Exploded — fades in mid-scroll */}
                  <div
                    className="hero-exploded absolute inset-0"
                    style={{ opacity: 0, visibility: "hidden" }}
                  >
                    <Image
                      src={blueprintImage}
                      alt="ClevaCado device exploded view"
                      sizes="(min-width: 1024px) 44vw, 88vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              <div className="hero-parallax-fast absolute bottom-[12%] left-[8%] hidden w-[220px] rounded-[28px] border border-white/10 bg-black/46 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.34)] backdrop-blur-md lg:block">
                <p className="telemetry-mono text-[11px] uppercase text-[#B7FF5A]/80">
                  Diagnostic payload
                </p>
                <div className="mt-4 grid gap-3 text-sm text-white/74">
                  <div className="flex items-center justify-between gap-4">
                    <span>Shock sensing</span>
                    <span className="telemetry-mono text-white/52">3-axis</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Sampling run</span>
                    <span className="telemetry-mono text-white/52">farm → market</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Output</span>
                    <span className="telemetry-mono text-white/52">hotspot map</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="architecture"
        ref={techSceneRef}
        className="relative lg:h-[380vh]"
      >
        <div
          ref={techStageRef}
          className="relative flex min-h-screen items-center overflow-hidden px-6 py-24 lg:h-screen lg:py-28"
        >
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="mobile-reveal max-w-[420px]">
              <p className="tech-copy text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B7FF5A]">
                Device architecture
              </p>
              <h2
                data-display="true"
                className="tech-copy mt-6 text-balance text-[clamp(2.8rem,5.6vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.06em]"
              >
                The device opens into the sensing stack.
              </h2>
              <p className="tech-copy mt-6 max-w-[380px] text-lg leading-relaxed text-white/58">
                Shell. Sensor core. Power. Data. Each layer exists to survive
                handling and resolve the signal.
              </p>

              <div className="live-copy mt-10 rounded-[28px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/42">
                  {activeTech.label}
                </p>
                <p
                  data-display="true"
                  className="mt-3 text-3xl font-semibold tracking-[-0.04em]"
                >
                  {activeTech.title}
                </p>
                <p className="mt-4 text-base leading-relaxed text-white/58">
                  {activeTech.detail}
                </p>
              </div>
            </div>

            <div className="mobile-reveal relative min-h-[740px]">
              <div
                className="absolute inset-0 rounded-[40px] border border-white/8"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(10,15,12,0.96) 0%, rgba(5,7,6,0.98) 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              />
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "64px 64px",
                }}
              />

              <div className="absolute inset-[8%]">
                <div className="tech-shell-base absolute inset-0">
                  <div className="absolute inset-0 opacity-[0.14]">
                    <Image
                      src={explodedDevice}
                      alt="ClevaCado exploded engineering view"
                      sizes="(min-width: 1024px) 50vw, 92vw"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  {TECH_LAYERS.map((layer, index) => (
                    <div
                      key={layer.id}
                      className={`tech-layer tech-layer-${layer.id} absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-500`}
                      style={{
                        backgroundImage: `url(${explodedDevice.src})`,
                        backgroundSize: "contain",
                        clipPath: layer.clipPath,
                        opacity: index === activeTechLayer ? 1 : 0.48,
                        zIndex: TECH_LAYERS.length - index,
                        filter:
                          index === activeTechLayer
                            ? "drop-shadow(0 0 26px rgba(183,255,90,0.18))"
                            : "none",
                      }}
                    >
                    </div>
                  ))}
                </div>

                {TECH_LAYERS.map((layer, index) => (
                  <div
                    key={layer.id}
                    className="tech-label absolute left-[62%] flex items-center gap-3"
                    style={{
                      top: `${18 + index * 18}%`,
                      opacity: index === activeTechLayer ? 1 : 0.52,
                    }}
                  >
                    <span
                      className="tech-connector block h-px w-20 scale-x-0"
                      style={{
                        background:
                          index === activeTechLayer
                            ? "linear-gradient(90deg, rgba(183,255,90,0.9), rgba(183,255,90,0.1))"
                            : "linear-gradient(90deg, rgba(255,255,255,0.28), rgba(255,255,255,0.04))",
                      }}
                    />
                    <div className="tech-label-chip rounded-full border border-white/8 bg-black/44 px-4 py-2 backdrop-blur-md">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/42">
                        {layer.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white/84">
                        {layer.title}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="absolute bottom-[8%] left-[8%] flex items-center gap-4 rounded-full border border-white/8 bg-black/40 px-5 py-3 text-sm text-white/58 backdrop-blur-md">
                  <Cpu size={16} className="text-[#B7FF5A]" />
                  3-axis shock, vibration and rotation sensing
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="journey"
        ref={journeySceneRef}
        className="relative lg:h-[500vh]"
      >
        <div className="lg:hidden px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <p className="mobile-reveal text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B7FF5A]">
              Journey pipeline
            </p>
            <h2
              data-display="true"
              className="mobile-reveal mt-6 text-balance text-[clamp(2.8rem,7vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.06em]"
            >
              One device. Five moments. One answer.
            </h2>
            <p className="mobile-reveal mt-5 max-w-[560px] text-lg leading-relaxed text-white/58">
              The device stays with the fruit. The environments move around it.
            </p>

            <div className="mt-12 space-y-4">
              {PIPELINE_FRAMES.map((frame) => (
                <article
                  key={frame.id}
                  className="mobile-reveal rounded-[30px] border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm"
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                    style={{ color: frame.accent }}
                  >
                    {frame.eyebrow}
                  </p>
                  <h3
                    data-display="true"
                    className="mt-4 text-3xl font-semibold tracking-[-0.04em]"
                  >
                    {frame.label}
                  </h3>
                  <p className="mt-4 text-lg font-medium text-white/84">
                    {frame.title}
                  </p>
                  <p className={`mt-3 text-sm ${TELEMETRY_CLASS}`}>{frame.signal}</p>
                  <p className={`mt-2 text-sm font-semibold ${TELEMETRY_CLASS}`}>
                    {frame.action}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div
          ref={journeyStageRef}
          className="relative hidden h-screen overflow-hidden lg:block"
        >
          <div
            className="pipeline-grid-far absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
              backgroundSize: "94px 94px",
              maskImage:
                "linear-gradient(180deg, rgba(0,0,0,0.84), rgba(0,0,0,0.14))",
            }}
          />
          <div
            className="pipeline-grid-near absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at center, rgba(183,255,90,0.08) 0%, transparent 38%)",
            }}
          />

          <div className="journey-copy absolute left-8 top-8 z-30 max-w-[460px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B7FF5A]">
              Journey pipeline
            </p>
            <h2
              data-display="true"
              className="mt-6 max-w-[420px] text-balance text-[clamp(2.8rem,4.4vw,4.8rem)] font-semibold leading-[0.94] tracking-[-0.06em]"
            >
              One device. Five moments. One answer.
            </h2>
          </div>

          <div className="pipeline-track absolute inset-y-0 left-0 flex w-[500vw]">
            {PIPELINE_FRAMES.map((frame, index) => (
              <ScenePanel key={frame.id} frame={frame} index={index} />
            ))}
          </div>

          <div className="pipeline-device absolute left-1/2 top-1/2 z-20 w-[360px] -translate-x-1/2 -translate-y-1/2">
            <div
              className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(183,255,90,0.18) 0%, rgba(94,209,67,0.08) 38%, rgba(94,209,67,0.01) 72%)",
              }}
            />
            <div
              className="relative z-10 overflow-hidden rounded-[38px] border border-white/8 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.42)]"
              style={{
                background:
                  "radial-gradient(circle at 50% 18%, rgba(183,255,90,0.24) 0%, rgba(246,247,242,0.98) 34%, rgba(223,232,216,0.9) 100%)",
              }}
            >
              <Image
                src={heroDevice}
                alt="ClevaCado fixed at the center of the journey pipeline"
                sizes="360px"
                className="w-full object-contain drop-shadow-[0_60px_140px_rgba(0,0,0,0.52)]"
              />
            </div>
          </div>

          <div className="pipeline-overlay-card absolute bottom-8 left-8 z-30 w-[440px] max-w-[calc(100vw-4rem)] rounded-[34px] border border-white/8 bg-black/52 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-md">
            <div className="live-copy" key={activeFrame.id}>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                style={{ color: activeFrame.accent }}
              >
                {activeFrame.eyebrow}
              </p>
              <p
                data-display="true"
                className="mt-4 text-4xl font-semibold tracking-[-0.05em]"
              >
                {activeFrame.label}
              </p>
              <p className="mt-5 text-xl font-medium leading-[1.3] text-white/86">
                {activeFrame.title}
              </p>
              <p className={`mt-4 text-sm ${TELEMETRY_CLASS}`}>{activeFrame.signal}</p>
              <p className={`mt-2 text-sm font-semibold ${TELEMETRY_CLASS}`}>
                {activeFrame.action}
              </p>
            </div>
          </div>

          <div className="absolute right-8 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3" role="list" aria-label="Journey stages">
            {PIPELINE_FRAMES.map((frame, index) => (
              <div
                key={frame.id}
                role="listitem"
                aria-label={`${frame.label}${index === activeFrameIndex ? " — current stage" : ""}`}
                className="h-14 w-[3px] rounded-full transition-all duration-300"
                style={{
                  background:
                    index === activeFrameIndex
                      ? `linear-gradient(180deg, ${frame.accent}, rgba(255,255,255,0.12))`
                      : "rgba(255,255,255,0.08)",
                  boxShadow:
                    index === activeFrameIndex
                      ? `0 0 24px ${frame.accent}`
                      : "none",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="analytics"
        ref={analyticsSceneRef}
        className="relative lg:h-[320vh]"
      >
        <div
          ref={analyticsStageRef}
          className="relative flex min-h-screen items-center overflow-hidden px-6 py-24 lg:h-screen lg:py-28"
        >
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div className="mobile-reveal max-w-[420px]">
              <p className="analytics-copy text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B7FF5A]">
                Deep analytics
              </p>
              <h2
                data-display="true"
                className="analytics-copy mt-6 text-balance text-[clamp(2.8rem,5.4vw,5.8rem)] font-semibold leading-[0.92] tracking-[-0.06em]"
              >
                The hotspot becomes obvious.
              </h2>
              <p className="analytics-copy mt-6 max-w-[380px] text-lg leading-relaxed text-white/58">
                One run resolves into a clear answer: where the risk peaked,
                what happened there, and what to fix next.
              </p>

              <div className="analytics-stat-cards mt-10 rounded-[28px] border border-white/8 bg-white/[0.03] p-5 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/42">
                  Hotspot
                </p>
                <p
                  data-display="true"
                  className="mt-3 text-2xl font-semibold tracking-[-0.04em]"
                >
                  Packhouse transfer line
                </p>
                <p className="mt-2 text-sm text-white/48">Sorting stage · Risk score 72</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="analytics-panel overflow-hidden rounded-[34px] border border-white/8 bg-[#090c0b]/88 shadow-[0_34px_110px_rgba(0,0,0,0.28)] backdrop-blur-md">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <BrandLogo variant="mark" markSize={26} />
                    <p className="text-sm font-semibold text-white/78">ClevaCado Analytics</p>
                  </div>
                  <span className="telemetry-mono rounded-full border border-[#B7FF5A]/25 bg-[#B7FF5A]/10 px-3 py-1.5 text-[10px] font-semibold uppercase text-[#B7FF5A]">
                    Demo run
                  </span>
                </div>

                <div className="grid gap-4 p-4 lg:grid-cols-2">
                  {/* Stage risk table */}
                  <div className="analytics-panel rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/42">
                      Stage risk profile
                    </p>
                    <div className="mt-4 space-y-2">
                      {JOURNEY_STAGES.map((stage) => {
                        const risk = RISK_META[stage.riskLevel];
                        const isHotspot = stage.id === "sorting-line";
                        return (
                          <div
                            key={stage.id}
                            className="analytics-row flex items-center gap-3 rounded-[14px] border px-3 py-2.5"
                            style={{
                              borderColor: isHotspot ? "rgba(249,115,22,0.28)" : "rgba(255,255,255,0.06)",
                              background: isHotspot ? "rgba(249,115,22,0.10)" : "rgba(255,255,255,0.02)",
                            }}
                          >
                            <span
                              className="h-2 w-2 flex-shrink-0 rounded-full"
                              style={{ background: risk.color, boxShadow: `0 0 10px ${risk.color}55` }}
                            />
                            <p className="flex-1 text-sm font-medium text-white/80">{stage.label}</p>
                            <span
                              className="telemetry-mono text-xs font-semibold"
                              style={{ color: risk.color }}
                            >
                              {stage.score}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: chart + 3 summary cards */}
                  <div className="flex flex-col gap-4">
                    <div className="analytics-panel rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/42">
                          Impact across the run
                        </p>
                        <Activity size={15} className="text-[#B7FF5A]" />
                      </div>
                      <svg viewBox="0 0 460 140" className="mt-3 h-[130px] w-full" fill="none" aria-hidden="true">
                        {[0, 1, 2].map((l) => (
                          <line key={l} x1="12" x2="448" y1={22 + l * 40} y2={22 + l * 40} stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                        ))}
                        <path className="analytics-plot-fill" d={impactArea} fill="url(#impact-fill)" opacity="0.8" />
                        <polyline
                          className="analytics-plot-line"
                          points={impactPolyline}
                          stroke="#B7FF5A" strokeWidth="2.5"
                          strokeLinecap="round" strokeLinejoin="round"
                          strokeDasharray="1200" strokeDashoffset="1200"
                        />
                        <defs>
                          <linearGradient id="impact-fill" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgba(183,255,90,0.28)" />
                            <stop offset="100%" stopColor="rgba(183,255,90,0)" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="analytics-panel rounded-[20px] border border-white/8 bg-white/[0.03] p-3">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/36">Risk</p>
                        <p
                          ref={scoreRef}
                          data-display="true"
                          className="telemetry-mono mt-1.5 text-3xl font-semibold tracking-[-0.05em]"
                        >
                          72
                        </p>
                        <p className="mt-1 text-[11px] text-white/44">Mod-high</p>
                      </div>
                      <div className="analytics-panel rounded-[20px] border border-white/8 bg-white/[0.03] p-3">
                        <div className="text-[#F97316]"><ScanLine size={15} /></div>
                        <p className="mt-2 text-xs font-semibold leading-snug text-white/80">Shock at 10:45</p>
                        <p className="mt-1 text-[11px] text-white/40">Sorting transfer</p>
                      </div>
                      <div className="analytics-panel rounded-[20px] border border-white/8 bg-white/[0.03] p-3">
                        <div className="text-[#B7FF5A]"><Database size={15} /></div>
                        <p className="mt-2 text-xs font-semibold leading-snug text-white/80">Reduce drop height</p>
                        <p className="mt-1 text-[11px] text-white/40">And retest</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="relative overflow-hidden px-6 pb-0 pt-28 sm:pt-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(183,255,90,0.09), transparent 44%)",
          }}
          aria-hidden="true"
        />

        <div className="mx-auto max-w-4xl text-center">
          <p className="mobile-reveal text-[10px] font-semibold uppercase tracking-[0.34em] text-[#B7FF5A]">
            Get in touch
          </p>
          <h2
            data-display="true"
            className="mobile-reveal mt-8 text-balance text-[clamp(2.8rem,6vw,6.4rem)] font-semibold leading-[0.92] tracking-[-0.07em]"
          >
            See where your fruit takes damage.
          </h2>
          <p className="mobile-reveal mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/58">
            ClevaCado is in active development. Join our pilot program and get
            early diagnostic insight into your handling chain.
          </p>

          <div className="mobile-reveal mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Pilot%20Request`}
              className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-base font-bold transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#B7FF5A]/40"
              style={{
                background: "#B7FF5A",
                color: "#040606",
                boxShadow: "0 14px 40px rgba(183,255,90,0.26)",
              }}
            >
              Request a pilot
              <ArrowRight size={18} />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center rounded-full border border-white/12 px-8 py-4 text-base font-medium text-white/64 backdrop-blur-sm transition-colors hover:border-white/24 hover:text-white/88"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="mobile-reveal mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              "Farm-to-market diagnostics",
              "Real handling environments",
              "Stage-by-stage hotspot maps",
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/48"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-7xl border-t border-white/8 px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/28 sm:flex-row">
            <div className="flex items-center gap-3">
              <BrandLogo variant="mark" markSize={24} />
              <span className="font-semibold tracking-[-0.02em] text-white/42">ClevaCado</span>
            </div>
            <p>Post-harvest diagnostics for avocado supply chains.</p>
            <p>© 2025 ClevaCado</p>
          </div>
        </div>
      </section>
    </div>
  );
}
