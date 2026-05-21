"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import {
  CircleAlert,
  CircleGauge,
  MapPin,
  TrendingUp,
} from "lucide-react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { JOURNEY_STAGES, RISK_META } from "@/lib/constants";
import { gsap, useGSAP } from "@/lib/gsap";
import BrandLogo from "./BrandLogo";

const DashboardSignalChart = dynamic(
  () => import("./DashboardSignalChart"),
  { ssr: false },
);

const INSIGHTS = [
  {
    icon: MapPin,
    title: "Damage hotspot",
    value: "Packhouse transfer point",
    detail: "Sorting line stage",
    color: "#EF4444",
    surface: "#FEEAE7",
  },
  {
    icon: CircleAlert,
    title: "Detected event",
    value: "High-impact shock at 10:45",
    detail: "Peak drop event during transfer",
    color: "#F97316",
    surface: "#FFF0DF",
  },
  {
    icon: TrendingUp,
    title: "Recommended action",
    value: "Reduce transfer drop height",
    detail: "Review bin tipping and conveyor handoff",
    color: "#2F8F46",
    surface: "#EAF5E5",
  },
] as const;

export default function AnalyticsDashboardMockup() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const counter = { value: prefersReducedMotion ? 72 : 0 };

      if (scoreRef.current) {
        scoreRef.current.textContent = String(counter.value);
      }

      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
          toggleActions: "play none none none",
        },
      });

      reveal
        .from(".dashboard-shell", {
          autoAlpha: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          ".dashboard-topbar",
          {
            autoAlpha: 0,
            y: 16,
            duration: 0.45,
            ease: "power2.out",
          },
          0.08,
        )
        .from(
          ".dashboard-row",
          {
            autoAlpha: 0,
            y: 18,
            stagger: 0.08,
            duration: 0.45,
            ease: "power2.out",
          },
          0.22,
        )
        .from(
          ".dashboard-card",
          {
            autoAlpha: 0,
            y: 22,
            stagger: 0.1,
            duration: 0.55,
            ease: "power2.out",
          },
          0.3,
        )
        .from(
          ".dashboard-insight",
          {
            autoAlpha: 0,
            y: 16,
            stagger: 0.08,
            duration: 0.45,
            ease: "power2.out",
          },
          0.42,
        );

      if (!prefersReducedMotion) {
        reveal
          .to(
            counter,
            {
              value: 72,
              duration: 1.15,
              ease: "power2.out",
              onUpdate: () => {
                if (scoreRef.current) {
                  scoreRef.current.textContent = String(Math.round(counter.value));
                }
              },
            },
            0.42,
          )
          .fromTo(
            ".dashboard-hotspot",
            {
              boxShadow: "0 0 0 0 rgba(249,115,22,0.18)",
            },
            {
              boxShadow: "0 0 0 14px rgba(249,115,22,0)",
              duration: 0.9,
              ease: "power2.out",
            },
            0.56,
          );

        gsap.to(".dashboard-live-badge", {
          scale: 1.03,
          boxShadow: "0 0 0 10px rgba(94,209,67,0)",
          duration: 1.8,
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
      className="dashboard-shell overflow-hidden rounded-[36px] border"
      style={{
        borderColor: "rgba(47,143,70,0.15)",
        background: "#FFFDF7",
        boxShadow: "0 28px 90px rgba(23,77,42,0.10)",
      }}
    >
      <div
        className="dashboard-topbar flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4"
        style={{ borderColor: "rgba(47,143,70,0.10)" }}
      >
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-orange-400" />
          <div className="ml-2 flex items-center gap-3">
            <BrandLogo variant="mark" markSize={28} />
            <p className="text-sm font-semibold" style={{ color: "#5E6B61" }}>
              ClevaCado Analytics - Run #1042
            </p>
          </div>
        </div>
        <span
          className="dashboard-live-badge rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
          style={{
            background: "#EAF5E5",
            color: "#2F8F46",
          }}
        >
          Live data
        </span>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          className="dashboard-card rounded-[28px] border p-6"
          style={{
            borderColor: "rgba(47,143,70,0.14)",
            background: "#F8F5EC",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#2F8F46" }}>
            Supply-chain map
          </p>
          <div className="mt-6 space-y-3">
            {JOURNEY_STAGES.map((stage) => {
              const risk = RISK_META[stage.riskLevel];
              const isHotspot = stage.id === "sorting-line";

              return (
                <div
                  key={stage.id}
                  className={`dashboard-row rounded-2xl border px-4 py-4 ${isHotspot ? "dashboard-hotspot" : ""}`}
                  style={{
                    borderColor: isHotspot
                      ? "rgba(249,115,22,0.18)"
                      : "rgba(47,143,70,0.10)",
                    background: isHotspot ? "#FFF4ED" : "#FFFDF7",
                  }}
                >
                  <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
                    <span
                      className="inline-flex h-4 w-4 rounded-full"
                      style={{ background: risk.color }}
                    />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#174D2A" }}>
                        {stage.label}
                      </p>
                      <p className="text-xs" style={{ color: "#6B756B" }}>
                        {isHotspot
                          ? "Packhouse transfer line hotspot"
                          : stage.measurement}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: risk.soft,
                        color: risk.color,
                      }}
                    >
                      {stage.score}/100
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div
            className="dashboard-card rounded-[28px] border p-6"
            style={{
              borderColor: "rgba(47,143,70,0.14)",
              background:
                "linear-gradient(180deg, rgba(255,253,247,0.98) 0%, rgba(248,245,236,0.98) 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: "#EAF5E5", color: "#2F8F46" }}
              >
                <CircleGauge size={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#2F8F46" }}>
                  Overall handling risk
                </p>
                <p
                  ref={scoreRef}
                  data-display="true"
                  className="mt-2 text-5xl font-semibold tracking-[-0.05em]"
                  style={{ color: "#162118" }}
                >
                  72
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold" style={{ color: "#314238" }}>
              Moderate-high risk profile
            </p>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "#5E6B61" }}>
              Highest-risk point: Packhouse transfer line inside the sorting
              stage.
            </p>
          </div>

          <div
            className="dashboard-card rounded-[28px] border p-6"
            style={{
              borderColor: "rgba(47,143,70,0.14)",
              background: "#FFFDF7",
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#6B756B" }}>
              Recommended next move
            </p>
            <p className="mt-3 text-xl font-semibold" style={{ color: "#174D2A" }}>
              Reduce transfer drop height and review bin tipping.
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "#5E6B61" }}>
              The signal pattern suggests bruising risk is being amplified
              during conveyor handoff at the packhouse.
            </p>
          </div>
        </div>
      </div>

      <div
        className="grid gap-6 border-t p-6 lg:grid-cols-[1.15fr_0.85fr]"
        style={{ borderColor: "rgba(47,143,70,0.10)" }}
      >
        <div
          className="dashboard-card rounded-[28px] border p-6"
          style={{
            borderColor: "rgba(47,143,70,0.14)",
            background: "#FFFDF7",
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#6B756B" }}>
            Impact and vibration over time
          </p>
          <div className="mt-5 h-[280px]">
            <DashboardSignalChart />
          </div>
        </div>

        <div className="space-y-4">
          {INSIGHTS.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="dashboard-insight rounded-[24px] border p-5"
                style={{
                  borderColor: `${card.color}20`,
                  background: card.surface,
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{
                      background: "#FFFFFF",
                      color: card.color,
                    }}
                  >
                    <Icon size={20} />
                  </span>
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.22em]"
                      style={{ color: card.color }}
                    >
                      {card.title}
                    </p>
                    <p className="mt-2 text-lg font-semibold" style={{ color: "#174D2A" }}>
                      {card.value}
                    </p>
                    <p className="mt-2 text-sm" style={{ color: "#5E6B61" }}>
                      {card.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
