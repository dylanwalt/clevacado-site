"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import { JOURNEY_STAGES, RISK_META } from "@/lib/constants";
import ClevaCadoLogo from "./ClevaCadoLogo";
import SectionLabel from "./SectionLabel";

const JOURNEY_PATH =
  "M14 84C17 78 20 73 24 68C28 63 34 57 41 50C48 43 56 36 63 29C70 22 78 16 90 9";

const ENVIRONMENT_CARDS = [
  {
    title: "Harvest",
    detail: "Field picking",
    className: "journey-bg-mid left-[6%] bottom-[10%]",
  },
  {
    title: "Packhouse",
    detail: "Sorting + transfer",
    className: "journey-bg-near left-[26%] bottom-[26%]",
  },
  {
    title: "Cold chain",
    detail: "Storage + route",
    className: "journey-bg-mid left-[56%] top-[22%]",
  },
  {
    title: "Market",
    detail: "Arrival report",
    className: "journey-bg-near right-[8%] top-[9%]",
  },
] as const;

export default function JourneyScrollytelling() {
  const rootRef = useRef<HTMLElement>(null);
  const pathProgressRef = useRef<SVGPathElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeStage = JOURNEY_STAGES[activeIndex];
  const activeRisk = RISK_META[activeStage.riskLevel];

  const jumpToStage = (index: number) => {
    if (!rootRef.current) return;

    const sectionTop = rootRef.current.offsetTop;
    const scrollRange = rootRef.current.offsetHeight - window.innerHeight;
    const progress = index / (JOURNEY_STAGES.length - 1);

    window.scrollTo({
      top: sectionTop + scrollRange * progress,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  useGSAP(
    () => {
      const path = pathProgressRef.current;
      const device = deviceRef.current;

      const mm = gsap.matchMedia();

      mm.add("(max-width: 1023px)", () => {
        if (prefersReducedMotion) return;

        gsap.utils
          .toArray<HTMLElement>(".journey-mobile-card")
          .forEach((card) => {
            gsap.from(card, {
              autoAlpha: 0,
              y: 28,
              duration: 0.55,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 84%",
                toggleActions: "play none none none",
              },
            });
          });
      });

      mm.add("(min-width: 1024px)", () => {
        if (path) {
          const pathLength = path.getTotalLength();
          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: prefersReducedMotion ? 0 : pathLength,
          });
        }

        if (device) {
          gsap.set(device, {
            left: `${JOURNEY_STAGES[0].position.x}%`,
            top: `${JOURNEY_STAGES[0].position.y}%`,
            xPercent: -50,
            yPercent: -50,
          });
        }

        if (prefersReducedMotion) {
          setActiveIndex(0);
          return;
        }

        const journeyTimeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".journey-shell",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: ".journey-sticky",
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextIndex = Math.min(
                JOURNEY_STAGES.length - 1,
                Math.max(0, Math.round(self.progress * (JOURNEY_STAGES.length - 1))),
              );
              setActiveIndex((previous) =>
                previous === nextIndex ? previous : nextIndex,
              );
            },
          },
        });

        if (path) {
          journeyTimeline.to(
            path,
            {
              strokeDashoffset: 0,
              duration: JOURNEY_STAGES.length - 1,
            },
            0,
          );
        }

        journeyTimeline
          .to(
            ".journey-bg-far",
            {
              yPercent: -10,
              duration: JOURNEY_STAGES.length - 1,
            },
            0,
          )
          .to(
            ".journey-bg-mid",
            {
              yPercent: -18,
              xPercent: -6,
              duration: JOURNEY_STAGES.length - 1,
            },
            0,
          )
          .to(
            ".journey-bg-near",
            {
              yPercent: -24,
              xPercent: 8,
              duration: JOURNEY_STAGES.length - 1,
            },
            0,
          );

        JOURNEY_STAGES.slice(1).forEach((stage, index) => {
          journeyTimeline.to(
            device,
            {
              left: `${stage.position.x}%`,
              top: `${stage.position.y}%`,
              duration: 1,
            },
            index,
          );
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      gsap
        .timeline()
        .fromTo(
          ".journey-stage-panel",
          {
            autoAlpha: 0.86,
            y: 14,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          },
        )
        .fromTo(
          ".journey-live-event",
          {
            autoAlpha: 0.78,
            scale: 0.97,
          },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.32,
            ease: "power2.out",
          },
          0,
        )
        .fromTo(
          ".journey-active-pulse",
          {
            autoAlpha: 0.24,
            scale: 0.84,
          },
          {
            autoAlpha: 0,
            scale: 1.45,
            duration: 0.6,
            ease: "power2.out",
          },
          0.06,
        );
    },
    { scope: rootRef, dependencies: [activeIndex, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <section id="journey" ref={rootRef} className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl lg:hidden">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel className="justify-center">The journey</SectionLabel>
          <h2
            data-display="true"
            className="text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Follow ClevaCado from farm to market.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            ClevaCado travels with the fruit, captures hidden handling stress,
            and shows producers where bruising begins.
          </p>
        </div>

        <div className="journey-mobile-stack relative mt-14 pl-7">
          <div
            className="absolute bottom-0 left-3 top-5 w-px"
            style={{
              background:
                "linear-gradient(180deg, #39D353 0%, rgba(57,211,83,0.12) 100%)",
            }}
            aria-hidden="true"
          />
          {JOURNEY_STAGES.map((stage, index) => {
            const risk = RISK_META[stage.riskLevel];

            return (
              <article
                key={stage.id}
                className="journey-mobile-card relative mb-6 rounded-[28px] border p-6"
                style={{
                  borderColor: "rgba(34,197,94,0.15)",
                  background: "#FFFFFF",
                  boxShadow: "0 20px 60px rgba(22,101,52,0.08)",
                }}
              >
                <span
                  className="absolute left-[-34px] top-8 inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white"
                  style={{
                    borderColor: "rgba(34,197,94,0.18)",
                  }}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: risk.color }}
                  />
                </span>
                {index === 0 && (
                  <div className="absolute left-[-58px] top-[-38px]">
                    <ClevaCadoLogo size={44} />
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                      Stage {stage.number}
                    </p>
                    <h3
                      data-display="true"
                      className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                    >
                      {stage.label}
                    </h3>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: risk.soft,
                      color: risk.color,
                    }}
                  >
                    {risk.label}
                  </span>
                </div>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {stage.description}
                </p>
                <p className="mt-4 text-sm font-semibold text-slate-800">
                  {stage.measurement}
                </p>
                <p className="mt-3 text-sm text-slate-500">{stage.event}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="journey-shell relative mx-auto hidden max-w-7xl lg:block" style={{ height: "520vh" }}>
        <div className="journey-sticky sticky top-0 flex h-screen items-center">
          <div className="grid w-full grid-cols-[0.9fr_1.1fr] gap-10">
            <div className="flex flex-col justify-center">
              <SectionLabel>The journey</SectionLabel>
              <h2
                data-display="true"
                className="max-w-xl text-balance text-5xl font-semibold tracking-[-0.05em] text-slate-950"
              >
                Follow ClevaCado from farm to market.
              </h2>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
                Each stage introduces different movement, shock, and vibration
                patterns. ClevaCado keeps the story visible from harvesting to
                market arrival.
              </p>

              <div
                key={activeStage.id}
                className="journey-stage-panel mt-9 rounded-[32px] border p-8"
                style={{
                  borderColor: "rgba(34,197,94,0.15)",
                  background: "rgba(255,255,255,0.92)",
                  boxShadow: "0 24px 70px rgba(22,101,52,0.08)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                      Stage {activeStage.number}
                    </p>
                    <h3
                      data-display="true"
                      className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950"
                    >
                      {activeStage.label}
                    </h3>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{
                      background: activeRisk.soft,
                      color: activeRisk.color,
                    }}
                  >
                    {activeRisk.label} risk
                  </span>
                </div>

                <p className="mt-5 text-base leading-relaxed text-slate-600">
                  {activeStage.description}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div
                    className="rounded-2xl border px-4 py-4"
                    style={{
                      borderColor: "rgba(34,197,94,0.13)",
                      background: "#F7FFF8",
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Measured
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {activeStage.measurement}
                    </p>
                  </div>
                  <div
                    className="journey-live-event rounded-2xl border px-4 py-4"
                    style={{
                      borderColor: "rgba(34,197,94,0.13)",
                      background: "#FFFFFF",
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Data event
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {activeStage.event}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-slate-500">
                  {activeStage.insight}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2">
                {JOURNEY_STAGES.map((stage, index) => (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => jumpToStage(index)}
                    className="inline-flex items-center justify-between rounded-full border px-4 py-3 text-left text-sm font-semibold transition-colors"
                    style={{
                      borderColor:
                        index === activeIndex
                          ? "rgba(34,197,94,0.24)"
                          : "rgba(34,197,94,0.12)",
                      background:
                        index === activeIndex
                          ? "#ECFDF3"
                          : "rgba(255,255,255,0.82)",
                      color: index === activeIndex ? "#166534" : "#475569",
                    }}
                  >
                    <span>{stage.short}</span>
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div
                className="relative h-[78vh] w-full overflow-hidden rounded-[36px] border"
                style={{
                  borderColor: "rgba(34,197,94,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(247,255,248,0.96) 100%)",
                  boxShadow: "0 24px 70px rgba(22,101,52,0.08)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(34,197,94,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.055) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="journey-bg-far absolute inset-x-8 bottom-10 h-24 rounded-[28px]"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(220,252,231,0.82), rgba(255,255,255,0))",
                  }}
                />
                <div
                  className="journey-bg-far absolute left-1/2 top-[12%] h-[260px] w-[260px] -translate-x-1/2 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(57,211,83,0.22) 0%, rgba(255,255,255,0) 72%)",
                  }}
                />

                {ENVIRONMENT_CARDS.map((card) => (
                  <div
                    key={card.title}
                    className={`absolute rounded-[24px] border px-4 py-3 ${card.className}`}
                    style={{
                      borderColor: "rgba(34,197,94,0.12)",
                      background: "rgba(255,255,255,0.9)",
                      boxShadow: "0 16px 40px rgba(22,101,52,0.06)",
                    }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                      {card.title}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
                  </div>
                ))}

                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d={JOURNEY_PATH}
                    stroke="#D1FAE5"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    ref={pathProgressRef}
                    d={JOURNEY_PATH}
                    stroke="#39D353"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {JOURNEY_STAGES.map((stage, index) => {
                    const risk = RISK_META[stage.riskLevel];
                    const isActive = index === activeIndex;

                    return (
                      <g key={stage.id}>
                        <circle
                          cx={stage.position.x}
                          cy={stage.position.y}
                          r={isActive ? 3.7 : 2.5}
                          fill={risk.color}
                        />
                        {isActive && (
                          <circle
                            className="journey-active-pulse"
                            cx={stage.position.x}
                            cy={stage.position.y}
                            r="4"
                            fill={risk.color}
                            fillOpacity="0.18"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {JOURNEY_STAGES.map((stage, index) => (
                  <div
                    key={stage.id}
                    className="absolute"
                    style={{
                      left: `${stage.position.x}%`,
                      top: `${stage.position.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute left-6 top-[-10px] rounded-full border px-3 py-1 text-xs font-semibold"
                      style={{
                        borderColor:
                          index === activeIndex
                            ? "rgba(34,197,94,0.18)"
                            : "rgba(34,197,94,0.10)",
                        background:
                          index === activeIndex
                            ? "rgba(255,255,255,0.96)"
                            : "rgba(255,255,255,0.82)",
                        color: index === activeIndex ? "#166534" : "#6B7280",
                        boxShadow:
                          index === activeIndex
                            ? "0 10px 30px rgba(22,101,52,0.08)"
                            : "none",
                      }}
                    >
                      {stage.label}
                    </div>
                  </div>
                ))}

                <div
                  ref={deviceRef}
                  className="absolute"
                  style={{
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="rounded-full border border-emerald-100 bg-white p-3 shadow-[0_18px_36px_rgba(22,101,52,0.15)]">
                    <ClevaCadoLogo size={64} />
                  </div>
                </div>

                <div
                  className="absolute right-6 top-6 max-w-[240px] rounded-[24px] border p-5"
                  style={{
                    borderColor: "rgba(34,197,94,0.12)",
                    background: "rgba(255,255,255,0.92)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Active risk
                  </p>
                  <p
                    className="mt-3 text-3xl font-semibold tracking-[-0.04em]"
                    style={{ color: activeRisk.color }}
                  >
                    {activeRisk.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {activeStage.label} introduces the current handling pattern
                    being measured.
                  </p>
                </div>

                <div
                  className="journey-live-event absolute bottom-6 left-6 max-w-[280px] rounded-[24px] border p-5"
                  style={{
                    borderColor: "rgba(34,197,94,0.12)",
                    background: "rgba(255,255,255,0.92)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                    Live event
                  </p>
                  <p className="mt-3 text-sm font-semibold text-slate-800">
                    {activeStage.event}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {activeStage.measurement}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
