"use client";

import { CircleAlert, ScanSearch, ShieldAlert } from "lucide-react";
import ProblemScanReveal from "./ProblemScanReveal";
import SectionLabel from "./SectionLabel";

const PROBLEM_POINTS = [
  {
    icon: ShieldAlert,
    title: "Looks fine outside",
    description: "Surface quality can still hide internal stress.",
  },
  {
    icon: ScanSearch,
    title: "Root cause stays hidden",
    description: "Teams see the bruise later, not the moment it started.",
  },
] as const;

export default function ProblemSection() {
  return (
    <section
      id="problem"
      className="px-6 py-24 sm:py-28"
      style={{ background: "#FAF8EF" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.86fr_1.14fr]">
        <div>
          <SectionLabel>The problem</SectionLabel>
          <h2
            data-display="true"
            className="max-w-[620px] text-balance text-4xl font-semibold tracking-[-0.05em] sm:text-5xl"
            style={{ color: "#162118" }}
          >
            Avocado bruising is often invisible until it is too late.
          </h2>
          <p className="mt-6 max-w-[620px] text-lg leading-relaxed" style={{ color: "#5E6B61" }}>
            By the time bruising appears, producers may not know whether the
            damage happened during harvesting, sorting, packing, storage, or
            transport. That makes the real process fix difficult to find.
          </p>
          <div
            className="mt-7 inline-flex items-center gap-3 rounded-full border px-4 py-3"
            style={{
              borderColor: "rgba(239,68,68,0.12)",
              background: "rgba(255,253,247,0.92)",
            }}
          >
            <CircleAlert size={18} color="#EF4444" />
            <span className="text-sm font-semibold" style={{ color: "#314238" }}>
              ClevaCado turns hidden handling damage into measurable data.
            </span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {PROBLEM_POINTS.map((point) => {
              const Icon = point.icon;

              return (
                <article
                  key={point.title}
                  className="rounded-[24px] border p-5"
                  style={{
                    borderColor: "rgba(47,143,70,0.12)",
                    background: "rgba(255,253,247,0.88)",
                    boxShadow: "0 14px 40px rgba(23,77,42,0.05)",
                  }}
                >
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: "#EAF5E5", color: "#2F8F46" }}
                  >
                    <Icon size={20} />
                  </span>
                  <h3
                    data-display="true"
                    className="mt-5 text-xl font-semibold tracking-[-0.03em]"
                    style={{ color: "#174D2A" }}
                  >
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "#5E6B61" }}>
                    {point.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <ProblemScanReveal />
      </div>
    </section>
  );
}
