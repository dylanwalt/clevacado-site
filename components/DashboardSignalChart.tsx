"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DASHBOARD_CHART_DATA } from "@/lib/constants";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; dataKey: string; value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-2xl border px-4 py-3 text-xs"
      style={{
        borderColor: "rgba(34,197,94,0.14)",
        background: "rgba(255,255,255,0.96)",
        boxShadow: "0 18px 40px rgba(22,101,52,0.08)",
      }}
    >
      <p className="font-semibold text-slate-900">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} style={{ color: item.color }}>
          {item.dataKey === "impact" ? "Impact" : "Vibration"}: {item.value}
        </p>
      ))}
    </div>
  );
}

export default function DashboardSignalChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={DASHBOARD_CHART_DATA}>
        <defs>
          <linearGradient id="impactFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="vibrationFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#39D353" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#39D353" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#ECFDF3" strokeDasharray="4 4" />
        <XAxis
          dataKey="time"
          tick={{ fill: "#94A3B8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94A3B8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="impact"
          stroke="#EF4444"
          fill="url(#impactFill)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="vibration"
          stroke="#39D353"
          fill="url(#vibrationFill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
