"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Factory,
  Leaf,
  Package,
  Truck,
} from "lucide-react";
import usePrefersReducedMotion from "@/hooks/usePrefersReducedMotion";
import { gsap, useGSAP } from "@/lib/gsap";
import { JOURNEY_CHAPTERS, RISK_META } from "@/lib/constants";
import BrandLogo from "./BrandLogo";
import SectionLabel from "./SectionLabel";

const JOURNEY_PATH =
  "M12 80C18 72 20 68 28 60C35 52 42 48 49 44C57 38 66 32 72 27C80 22 85 17 90 12";

const STORY_ICONS = [Leaf, Package, Factory, Truck, BarChart3];
const BACKDROP_STATES = [
  {
    title: "Harvest",
    detail: "Field picking",
    Icon: Leaf,
    className: "journey-bg-far left-[8%] bottom-[12%]",
  },
  {
    title: "Bins",
    detail: "Tipping + transfer",
    Icon: Package,
    className: "journey-bg-mid left-[26%] bottom-[30%]",
  },
  {
    title: "Sorting",
    detail: "Packhouse hotspot",
    Icon: Factory,
    className: "journey-bg-near left-[46%] top-[24%]",
  },
  {
    title: "Transport",
    detail: "Route vibration",
    Icon: Truck,
    className: "journey-bg-mid right-[16%] top-[18%]",
  },
  {
    title: "Report",
    detail: "Actionable answer",
    Icon: BarChart3,
    className: "journey-bg-near right-[10%] bottom-[14%]",
  },
] as const;

export default function JourneyScrollytelling() {
  const rootRef = useRef<HTMLElement>(null);
  const pathProgressRef = useRef<SVGPathElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeChapter = JOURNEY_CHAPTERS[activeIndex];
  const activeRisk = RISK_META[activeChapter.riskLevel];

  const jumpToChapter = (index: number) => {
    if (!rootRef.current) return;

    const sectionTop = rootRef.current.offsetTop;
    const scrollRange = rootRef.current.offsetHeight - window.innerHeight;
    const progress = index / (JOURNEY_CHAPTERS.length - 1);

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
                start: "top 86%",
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
            left: `${JOURNEY_CHAPTERS[0].position.x}%`,
            top: `${JOURNEY_CHAPTERS[0].position.y}%`,
            xPercent: -50,
            yPercent: -50,
          });
        }

        if (prefersReducedMotion) {
          setActiveIndex(0);
          return;
        }

        const tl = gsap.timeline({
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
                JOURNEY_CHAPTERS.length - 1,
                Math.max(0, Math.round(self.progress * (JOURNEY_CHAPTERS.length - 1))),
              );
              setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
            },
          },
        });

        if (path) {
          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: JOURNEY_CHAPTERS.length - 1,
            },
            0,
          );
        }

        tl.to(
          ".journey-bg-far",
          {
            yPercent: -10,
            duration: JOURNEY_CHAPTERS.length - 1,
          },
          0,
        )
          .to(
            ".journey-bg-mid",
            {
              yPercent: -16,
              xPercent: -5,
              duration: JOURNEY_CHAPTERS.length - 1,
            },
            0,
          )
          .to(
            ".journey-bg-near",
            {
              yPercent: -22,
              xPercent: 6,
              duration: JOURNEY_CHAPTERS.length - 1,
            },
            0,
          );

        JOURNEY_CHAPTERS.slice(1).forEach((chapter, index) => {
          tl.to(
            device,
            {
              left: `${chapter.position.x}%`,
              top: `${chapter.position.y}%`,
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
          ".journey-chapter-card",
          { autoAlpha: 0.86, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
        )
        .fromTo(
          ".journey-risk-pulse",
          { autoAlpha: 0.22, scale: 0.82 },
          { autoAlpha: 0, scale: 1.5, duration: 0.62, ease: "power2.out" },
          0.04,
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
            className="text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl"
            style={{ color: "#162118" }}
          >
            One smart avocado. Five moments that reveal the damage.
          </h2>
          <p className="mt-5 text-lg leading-relaxed" style={{ color: "#5E6B61" }}>
            Scroll through the handling journey and watch ClevaCado turn
            invisible stress into clear action.
          </p>
        </div>

        <div className="journey-mobile-stack relative mt-14 pl-7">
          <div
            className="absolute bottom-0 left-3 top-5 w-px"
            style={{
              background:
                "linear-gradient(180deg, #5ED143 0%, rgba(94,209,67,0.12) 100%)",
            }}
            aria-hidden="true"
          />

          {JOURNEY_CHAPTERS.map((chapter, index) => {
            const Icon = STORY_ICONS[index];
            const risk = RISK_META[chapter.riskLevel];

            return (
              <article
                key={chapter.id}
                className="journey-mobile-card relative mb-6 rounded-[28px] border p-6"
                style={{
                  borderColor: "rgba(47,143,70,0.12)",
                  background: "rgba(255,253,247,0.94)",
                  boxShadow: "0 20px 60px rgba(23,77,42,0.06)",
                }}
              >
                <span
                  className="absolute left-[-34px] top-8 inline-flex h-7 w-7 items-center justify-center rounded-full border"
                  style={{
                    borderColor: "rgba(47,143,70,0.16)",
                    background: "#FFFDF7",
                  }}
                >
                  <span className="h-3 w-3 rounded-full" style={{ background: risk.color }} />
                </span>
                {index === 0 && (
                  <div className="absolute left-[-60px] top-[-38px]">
                    <BrandLogo variant="mark" markSize={44} />
                  </div>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ background: "#EAF5E5", color: "#2F8F46" }}
                    >
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#2F8F46" }}>
                        Chapter {chapter.number}
                      </p>
                      <h3
                        data-display="true"
                        className="mt-2 text-2xl font-semibold tracking-[-0.03em]"
                        style={{ color: "#174D2A" }}
                      >
                        {chapter.title}
                      </h3>
                    </div>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: risk.soft, color: risk.color }}
                  >
                    {risk.label}
                  </span>
                </div>

                <p className="mt-5 text-base font-medium" style={{ color: "#314238" }}>
                  {chapter.risk}
                </p>
                <p className="mt-3 text-sm" style={{ color: "#5E6B61" }}>
                  {chapter.event}
                </p>
                <p className="mt-2 text-sm font-semibold" style={{ color: "#174D2A" }}>
                  {chapter.action}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <div
        className="journey-shell relative mx-auto hidden max-w-7xl lg:block"
        style={{ height: "500vh" }}
      >
        <div className="journey-sticky sticky top-0 flex h-screen items-center">
          <div className="grid w-full grid-cols-[0.86fr_1.14fr] gap-12">
            <div className="flex flex-col justify-center">
              <SectionLabel>The journey</SectionLabel>
              <h2
                data-display="true"
                className="max-w-[580px] text-balance text-5xl font-semibold tracking-[-0.06em]"
                style={{ color: "#162118" }}
              >
                One smart avocado. Five moments that reveal the damage.
              </h2>
              <p className="mt-5 max-w-[560px] text-lg leading-relaxed" style={{ color: "#5E6B61" }}>
                Scroll through the handling journey and watch ClevaCado turn
                invisible stress into clear action.
              </p>

              <div
                key={activeChapter.id}
                className="journey-chapter-card mt-9 rounded-[34px] border p-8"
                style={{
                  borderColor: "rgba(47,143,70,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(255,253,247,0.96) 0%, rgba(250,248,239,0.96) 100%)",
                  boxShadow: "0 24px 70px rgba(23,77,42,0.08)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#2F8F46" }}>
                      Chapter {activeChapter.number}
                    </p>
                    <h3
                      data-display="true"
                      className="mt-3 text-4xl font-semibold tracking-[-0.05em]"
                      style={{ color: "#174D2A" }}
                    >
                      {activeChapter.title}
                    </h3>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: activeRisk.soft, color: activeRisk.color }}
                  >
                    {activeRisk.label}
                  </span>
                </div>

                <div className="mt-7 space-y-4">
                  <p className="text-xl font-medium leading-[1.35]" style={{ color: "#314238" }}>
                    {activeChapter.risk}
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: "#5E6B61" }}>
                    {activeChapter.event}
                  </p>
                  <p className="text-base font-semibold leading-relaxed" style={{ color: "#174D2A" }}>
                    {activeChapter.action}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-5 gap-2">
                {JOURNEY_CHAPTERS.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => jumpToChapter(index)}
                    className="inline-flex items-center justify-between rounded-full border px-4 py-3 text-left text-sm font-semibold transition-colors"
                    style={{
                      borderColor:
                        index === activeIndex
                          ? "rgba(47,143,70,0.24)"
                          : "rgba(47,143,70,0.12)",
                      background:
                        index === activeIndex
                          ? "#EAF5E5"
                          : "rgba(255,253,247,0.82)",
                      color: index === activeIndex ? "#174D2A" : "#5E6B61",
                    }}
                  >
                    <span>{chapter.short}</span>
                    <ArrowRight size={14} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div
                className="relative h-[78vh] w-full overflow-hidden rounded-[40px] border"
                style={{
                  borderColor: "rgba(47,143,70,0.14)",
                  background:
                    "linear-gradient(180deg, rgba(255,253,247,0.96) 0%, rgba(250,248,239,0.96) 100%)",
                  boxShadow: "0 24px 70px rgba(23,77,42,0.08)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      "repeating-radial-gradient(circle at center, rgba(23,77,42,0.032) 0 1px, transparent 1px 32px)",
                  }}
                  aria-hidden="true"
                />
                <div
                  className="journey-bg-far absolute left-1/2 top-[12%] h-[280px] w-[280px] -translate-x-1/2 rounded-full blur-3xl"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(183,255,90,0.18) 0%, rgba(94,209,67,0.06) 42%, rgba(94,209,67,0) 72%)",
                  }}
                />

                {BACKDROP_STATES.map((state, index) => {
                  const Icon = state.Icon;
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={state.title}
                      className={`absolute rounded-[26px] border px-5 py-4 transition-all duration-500 ${state.className}`}
                      style={{
                        borderColor: isActive
                          ? "rgba(47,143,70,0.18)"
                          : "rgba(47,143,70,0.08)",
                        background: isActive
                          ? "rgba(255,253,247,0.94)"
                          : "rgba(255,253,247,0.72)",
                        boxShadow: isActive
                          ? "0 16px 40px rgba(23,77,42,0.08)"
                          : "none",
                        opacity: isActive ? 1 : 0.42,
                        transform: isActive ? "scale(1)" : "scale(0.96)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                          style={{ background: "#EAF5E5", color: "#2F8F46" }}
                        >
                          <Icon size={20} />
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#2F8F46" }}>
                            {state.title}
                          </p>
                          <p className="mt-1 text-sm" style={{ color: "#5E6B61" }}>
                            {state.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d={JOURNEY_PATH}
                    stroke="#DDEDD8"
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    ref={pathProgressRef}
                    d={JOURNEY_PATH}
                    stroke="#5ED143"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  {JOURNEY_CHAPTERS.map((chapter, index) => {
                    const risk = RISK_META[chapter.riskLevel];
                    const isActive = index === activeIndex;

                    return (
                      <g key={chapter.id}>
                        <circle
                          cx={chapter.position.x}
                          cy={chapter.position.y}
                          r={isActive ? 3.7 : 2.7}
                          fill={risk.color}
                        />
                        {isActive && (
                          <circle
                            className="journey-risk-pulse"
                            cx={chapter.position.x}
                            cy={chapter.position.y}
                            r="4"
                            fill={risk.color}
                            fillOpacity="0.18"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                {JOURNEY_CHAPTERS.map((chapter, index) => {
                  const Icon = STORY_ICONS[index];
                  const isActive = index === activeIndex;

                  return (
                    <div
                      key={chapter.id}
                      className="absolute"
                      style={{
                        left: `${chapter.position.x}%`,
                        top: `${chapter.position.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div
                        className="pointer-events-none absolute left-5 top-[-10px] rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300"
                        style={{
                          borderColor: isActive
                            ? "rgba(47,143,70,0.18)"
                            : "rgba(47,143,70,0.08)",
                          background: isActive
                            ? "rgba(255,253,247,0.96)"
                            : "rgba(255,253,247,0.72)",
                          color: isActive ? "#174D2A" : "#738175",
                          boxShadow: isActive
                            ? "0 10px 30px rgba(23,77,42,0.06)"
                            : "none",
                        }}
                      >
                        {chapter.title}
                      </div>
                      <span
                        className="absolute left-[-18px] top-[-18px] inline-flex h-10 w-10 items-center justify-center rounded-2xl border"
                        style={{
                          borderColor: "rgba(47,143,70,0.16)",
                          background: "#FFFDF7",
                          color: "#2F8F46",
                        }}
                      >
                        <Icon size={18} />
                      </span>
                    </div>
                  );
                })}

                <div
                  ref={deviceRef}
                  className="absolute"
                  style={{ transform: "translate(-50%, -50%)" }}
                >
                  <div
                    className="rounded-full border p-3 shadow-[0_18px_36px_rgba(23,77,42,0.12)]"
                    style={{
                      borderColor: "rgba(47,143,70,0.14)",
                      background: "#FFFDF7",
                    }}
                  >
                    <BrandLogo variant="mark" markSize={64} />
                  </div>
                </div>

                <div
                  className="absolute left-6 top-6 max-w-[240px] rounded-[26px] border p-5 transition-all duration-500"
                  style={{
                    borderColor: "rgba(47,143,70,0.14)",
                    background: "rgba(255,253,247,0.92)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#5E6B61" }}>
                    Active risk
                  </p>
                  <p
                    className="mt-3 text-3xl font-semibold tracking-[-0.04em]"
                    style={{ color: activeRisk.color }}
                  >
                    {activeRisk.label}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "#5E6B61" }}>
                    {activeChapter.risk}
                  </p>
                </div>

                <div
                  className="absolute bottom-6 left-6 max-w-[280px] rounded-[26px] border p-5"
                  style={{
                    borderColor: "rgba(47,143,70,0.14)",
                    background: "rgba(255,253,247,0.92)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#2F8F46" }}>
                    Live event
                  </p>
                  <p className="mt-3 text-sm font-semibold" style={{ color: "#174D2A" }}>
                    {activeChapter.event}
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "#5E6B61" }}>
                    {activeChapter.action}
                  </p>
                </div>

                <div
                  className="journey-report-preview absolute bottom-6 right-6 max-w-[250px] rounded-[26px] border p-5 transition-all duration-500"
                  style={{
                    borderColor: "rgba(47,143,70,0.14)",
                    background: "rgba(255,253,247,0.94)",
                    opacity: activeIndex === JOURNEY_CHAPTERS.length - 1 ? 1 : 0.18,
                    transform:
                      activeIndex === JOURNEY_CHAPTERS.length - 1
                        ? "translateY(0)"
                        : "translateY(12px)",
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "#2F8F46" }}>
                    Report preview
                  </p>
                  <p
                    data-display="true"
                    className="mt-3 text-3xl font-semibold tracking-[-0.04em]"
                    style={{ color: "#174D2A" }}
                  >
                    72 / 100
                  </p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: "#174D2A" }}>
                    Packhouse transfer line
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "#5E6B61" }}>
                    Reduce handoff height and retest the run.
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
