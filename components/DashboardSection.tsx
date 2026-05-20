"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { AlertTriangle, TrendingDown, MapPin, CheckCircle } from "lucide-react";
import { DASHBOARD_CHART_DATA } from "@/lib/constants";
import SectionLabel from "./SectionLabel";

const STAGE_RISKS = [
  { stage: "Harvest", risk: 42, color: "#FACC15" },
  { stage: "Bins", risk: 61, color: "#FB923C" },
  { stage: "Sorting", risk: 88, color: "#EF4444" },
  { stage: "Packing", risk: 18, color: "#39D353" },
  { stage: "Storage", risk: 47, color: "#FACC15" },
  { stage: "Transport", risk: 72, color: "#FB923C" },
  { stage: "Market", risk: 12, color: "#39D353" },
];

const INSIGHT_CARDS = [
  {
    icon: MapPin,
    label: "Damage Hotspot",
    value: "Packhouse transfer point",
    sub: "Stage 03 — Sorting Line",
    color: "#EF4444",
    bg: "#FEE2E2",
  },
  {
    icon: AlertTriangle,
    label: "Detected Event",
    value: "High-impact shock at 10:45",
    sub: "4.8 g — above 3.5 g threshold",
    color: "#FB923C",
    bg: "#FFEDD5",
  },
  {
    icon: TrendingDown,
    label: "Risk Score",
    value: "72 / 100",
    sub: "Moderate–High overall",
    color: "#FACC15",
    bg: "#FEF9C3",
  },
  {
    icon: CheckCircle,
    label: "Recommended Action",
    value: "Reduce transfer drop height",
    sub: "Review bin-tipping procedure",
    color: "#39D353",
    bg: "#DCFCE7",
  },
];

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl p-3 text-xs"
      style={{
        background: "white",
        border: "1px solid #DCFCE7",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <p className="font-bold mb-1" style={{ color: "#1F2937" }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.dataKey === "impact" ? "Impact" : "Vibration"}: {p.value} g
        </p>
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DashboardSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);
  return (
    <section
      id="dashboard"
      className="py-32 px-6"
      style={{ background: "#F7FFF8" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionLabel className="justify-center">THE DASHBOARD</SectionLabel>
          <h2
            className="text-3xl md:text-4xl font-extrabold max-w-2xl mx-auto leading-tight mb-4"
            style={{ color: "#1F2937" }}
          >
            From movement data to{" "}
            <span style={{ color: "#39D353" }}>bruising-risk intelligence.</span>
          </h2>
          <p className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
            ClevaCado converts handling events into a clear dashboard that shows
            where damage risk is highest across the supply chain.
          </p>
        </motion.div>

        {/* Main dashboard card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: "white",
            boxShadow: "0 8px 48px rgba(57,211,83,0.10), 0 2px 12px rgba(0,0,0,0.06)",
            border: "1px solid #DCFCE7",
          }}
        >
          {/* Dashboard top bar */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "#F0FDF4" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: "#EF4444" }} aria-hidden="true" />
              <div className="w-3 h-3 rounded-full" style={{ background: "#FACC15" }} aria-hidden="true" />
              <div className="w-3 h-3 rounded-full" style={{ background: "#39D353" }} aria-hidden="true" />
              <span className="text-xs font-medium ml-2" style={{ color: "#9CA3AF" }}>
                ClevaCado Analytics — Run #1042
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full animate-pulse"
                style={{ background: "#DCFCE7", color: "#166534" }}
              >
                ● Live data
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Overall risk banner */}
            <div
              className="flex items-center justify-between mb-6 p-4 rounded-2xl"
              style={{ background: "#FFEDD5", border: "1px solid #FB923C30" }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#9A3412" }}>
                  Overall Handling Risk
                </p>
                <p className="text-2xl font-extrabold" style={{ color: "#9A3412" }}>
                  Moderate–High
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold" style={{ color: "#9A3412" }}>Highest risk point</p>
                <p className="font-bold text-sm" style={{ color: "#9A3412" }}>Packhouse Transfer Line</p>
              </div>
            </div>

            {/* Chart */}
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>
                Impact &amp; Vibration over Supply Chain
              </p>
              <div style={{ height: 260 }}>
                {mounted && <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={DASHBOARD_CHART_DATA as unknown as Record<string, unknown>[]}
                    margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="impactGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#39D353" stopOpacity={0.20} />
                        <stop offset="95%" stopColor="#39D353" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0FDF4" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 11, fill: "#9CA3AF" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9CA3AF" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                      y={3.5}
                      stroke="#EF4444"
                      strokeDasharray="4 3"
                      label={{ value: "Risk threshold", fill: "#EF4444", fontSize: 11 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="impact"
                      stroke="#EF4444"
                      strokeWidth={2}
                      fill="url(#impactGrad)"
                      name="Impact"
                    />
                    <Area
                      type="monotone"
                      dataKey="vibration"
                      stroke="#39D353"
                      strokeWidth={2}
                      fill="url(#vibGrad)"
                      name="Vibration"
                    />
                  </AreaChart>
                </ResponsiveContainer>}
              </div>
              <div className="flex items-center gap-5 mt-3">
                <span className="flex items-center gap-2 text-sm" style={{ color: "#6B7280" }}>
                  <span className="inline-block w-4 h-0.5" style={{ background: "#EF4444" }} />
                  Impact (g)
                </span>
                <span className="flex items-center gap-2 text-sm" style={{ color: "#6B7280" }}>
                  <span className="inline-block w-4 h-0.5" style={{ background: "#39D353" }} />
                  Vibration (g)
                </span>
              </div>
            </div>

            {/* Stage risk bars */}
            <div className="mb-6">
              <p className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "#9CA3AF" }}>
                Stage-by-Stage Risk Score
              </p>
              <div className="flex gap-2 items-end">
                {STAGE_RISKS.map((s) => (
                  <div key={s.stage} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold" style={{ color: s.risk > 60 ? s.color : "#9CA3AF" }}>
                      {s.risk}
                    </span>
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{
                        height: `${s.risk * 0.8}px`,
                        background: s.color,
                        opacity: 0.85,
                        minHeight: 4,
                      }}
                      role="meter"
                      aria-valuenow={s.risk}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${s.stage} risk: ${s.risk}/100`}
                    />
                    <span className="text-center" style={{ fontSize: 9, color: "#9CA3AF", lineHeight: 1.2 }}>
                      {s.stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {INSIGHT_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    variants={itemVariants}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{
                      background: card.bg,
                      border: `1px solid ${card.color}20`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${card.color}20` }}
                      aria-hidden="true"
                    >
                      <Icon size={16} color={card.color} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: card.color }}>
                        {card.label}
                      </p>
                      <p className="font-semibold text-base mt-1" style={{ color: "#1F2937" }}>
                        {card.value}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
                        {card.sub}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
