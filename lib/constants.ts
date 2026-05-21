export const COLORS = {
  white: "#FFFFFF",
  softWhite: "#F7FFF8",
  primaryGreen: "#39D353",
  secondaryGreen: "#22C55E",
  deepGreen: "#15803D",
  darkGreen: "#166534",
  charcoal: "#1F2937",
  mutedText: "#6B7280",
  lightGreen: "#DCFCE7",
  warningYellow: "#FACC15",
  riskOrange: "#FB923C",
  riskRed: "#EF4444",
} as const;

export const CONTACT_EMAIL = "hello@clevacado.com";

export const RISK_META = {
  low: {
    label: "Low",
    color: COLORS.primaryGreen,
    soft: "#ECFDF3",
  },
  moderate: {
    label: "Moderate",
    color: COLORS.warningYellow,
    soft: "#FEF9C3",
  },
  high: {
    label: "High",
    color: COLORS.riskOrange,
    soft: "#FFEDD5",
  },
  critical: {
    label: "Critical",
    color: COLORS.riskRed,
    soft: "#FEE2E2",
  },
} as const;

export type RiskLevel = keyof typeof RISK_META;

export type JourneyStage = {
  id: string;
  number: string;
  label: string;
  short: string;
  description: string;
  measurement: string;
  insight: string;
  event: string;
  riskLevel: RiskLevel;
  score: number;
  position: {
    x: number;
    y: number;
  };
};

export const HERO_CHIPS = [
  "Impact detected",
  "Vibration mapped",
  "Bruising risk identified",
  "3-axis motion sensing",
  "Farm-to-market tracking",
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    id: "flow",
    number: "01",
    title: "Place ClevaCado into the handling flow",
    description:
      "The device moves through the same journey as real avocados, from harvesting to market arrival.",
  },
  {
    id: "measure",
    number: "02",
    title: "Measure motion and stress events",
    description:
      "Embedded sensors capture impact, vibration, rotation, drops, and handling stress in real time.",
  },
  {
    id: "find",
    number: "03",
    title: "Find the damage hotspots",
    description:
      "Producers receive a clear risk profile showing where fruit quality is most likely being lost.",
  },
] as const;

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "harvesting",
    number: "01",
    label: "Harvesting",
    short: "Harvest",
    description:
      "Drops, knocks, and rough picking can create bruising risk before the fruit even reaches the packhouse.",
    measurement:
      "ClevaCado records early impact events at the source.",
    insight:
      "The first handling moments already shape downstream fruit quality.",
    event: "Impact detected: 2.1 g at point of pick",
    riskLevel: "moderate",
    score: 24,
    position: { x: 14, y: 84 },
  },
  {
    id: "bin-handling",
    number: "02",
    label: "Bin handling",
    short: "Bins",
    description:
      "Tipping, stacking, and transfer points can introduce repeated mechanical stress before sorting begins.",
    measurement:
      "ClevaCado identifies high-impact handling moments before they become hidden quality losses.",
    insight:
      "Repeated shocks accumulate long before bruising becomes visible.",
    event: "Shock detected: 3.1 g during bin tipping",
    riskLevel: "high",
    score: 46,
    position: { x: 21, y: 68 },
  },
  {
    id: "sorting-line",
    number: "03",
    label: "Sorting line",
    short: "Sorting",
    description:
      "Conveyors and transfer points can expose avocados to vibration, tumbling, and sudden drops.",
    measurement:
      "ClevaCado maps motion patterns across the packhouse line.",
    insight:
      "The packhouse transfer line is the clearest bruising-risk hotspot in this run.",
    event: "High-impact transfer shock at 10:45",
    riskLevel: "critical",
    score: 72,
    position: { x: 38, y: 53 },
  },
  {
    id: "packing",
    number: "04",
    label: "Packing",
    short: "Packing",
    description:
      "Small handling changes can affect whether fruit arrives in premium condition.",
    measurement:
      "ClevaCado helps teams identify where process improvements matter most.",
    insight:
      "Gentler transitions here reduce cumulative damage after sorting.",
    event: "Moderate rotation pattern through carton loading",
    riskLevel: "moderate",
    score: 41,
    position: { x: 53, y: 39 },
  },
  {
    id: "cold-storage",
    number: "05",
    label: "Cold storage",
    short: "Storage",
    description:
      "Loading, movement, and storage transitions can still create damage risk inside the cold chain.",
    measurement:
      "ClevaCado records stress events during cold-chain handling.",
    insight:
      "Storage is relatively controlled, but loading transitions still matter.",
    event: "Storage transition vibration above threshold for 12 minutes",
    riskLevel: "moderate",
    score: 29,
    position: { x: 68, y: 28 },
  },
  {
    id: "transport",
    number: "06",
    label: "Transport",
    short: "Transport",
    description:
      "Long-duration vibration and repeated shocks can reduce quality before arrival.",
    measurement:
      "ClevaCado tracks vibration exposure and route-level handling risk.",
    insight:
      "Transport is stable overall, but sustained vibration still adds pressure to fruit quality.",
    event: "Route vibration exposure above target for 22 minutes",
    riskLevel: "high",
    score: 53,
    position: { x: 82, y: 17 },
  },
  {
    id: "market-arrival",
    number: "07",
    label: "Market arrival",
    short: "Market",
    description:
      "Instead of guessing where bruising happened, producers receive a clear damage-risk profile from farm to market.",
    measurement:
      "ClevaCado turns the full handling journey into decision-ready diagnostics.",
    insight:
      "The run closes with one clear instruction: fix the sorting transfer line first.",
    event: "Farm-to-market report generated",
    riskLevel: "low",
    score: 18,
    position: { x: 90, y: 8 },
  },
];

export const TECHNOLOGY_FEATURES = [
  {
    id: "impact",
    title: "Impact-event detection",
    description:
      "Detects sudden shocks and drops that may contribute to bruising risk.",
    metric: "Shock threshold logging",
  },
  {
    id: "vibration",
    title: "Vibration exposure tracking",
    description:
      "Measures repeated movement during conveyors, loading, cold storage, and transport.",
    metric: "3-axis sensing",
  },
  {
    id: "rotation",
    title: "Rotational motion sensing",
    description:
      "Uses gyroscopic data to understand tumbling, rolling, and orientation changes.",
    metric: "Orientation changes",
  },
  {
    id: "profiling",
    title: "Damage-risk profiling",
    description:
      "Converts raw motion data into stage-by-stage handling insights.",
    metric: "Decision-ready outputs",
  },
] as const;

export const TRUST_POINTS = [
  "impact events",
  "vibration exposure",
  "orientation changes",
  "handling shocks",
  "stage-by-stage risk profiles",
  "farm-to-market diagnostics",
] as const;

export const AUDIENCE_CARDS = [
  {
    id: "farmers",
    title: "Farmers",
    description:
      "Improve harvesting and early handling practices before hidden bruising compounds.",
  },
  {
    id: "packhouses",
    title: "Packhouses",
    description:
      "Identify risky transfer points, conveyors, and sorting processes inside the facility.",
  },
  {
    id: "exporters",
    title: "Exporters",
    description:
      "Improve quality consistency before long-distance transport and market arrival.",
  },
  {
    id: "logistics",
    title: "Logistics teams",
    description:
      "Understand vibration and shock exposure during storage movements and transport.",
  },
] as const;

export const IMPACT_CARDS = [
  {
    id: "losses",
    title: "Reduce post-harvest losses",
    description:
      "Find the handling moments that quietly erode fruit quality across the chain.",
  },
  {
    id: "yield",
    title: "Improve marketable yield",
    description:
      "Protect more fruit so more of every harvest reaches buyers in premium condition.",
  },
  {
    id: "quality",
    title: "Support food quality",
    description:
      "Give teams better evidence to protect consistency, freshness, and shelf-life outcomes.",
  },
  {
    id: "data",
    title: "Empower farmers with data",
    description:
      "Replace guesswork with measurable diagnostics that point to practical handling fixes.",
  },
  {
    id: "waste",
    title: "Reduce food waste",
    description:
      "Even small handling improvements can protect more fruit across large harvest volumes.",
  },
  {
    id: "process",
    title: "Enable better processes",
    description:
      "Make it easier for teams to improve transfer points, handling methods, and operating routines.",
  },
] as const;

export const IMPACT_STRIP = [
  "Stage-by-stage visibility",
  "Faster process fixes",
  "Clearer post-harvest decisions",
] as const;

export const DASHBOARD_CHART_DATA = [
  { time: "09:00", impact: 0.4, vibration: 0.2 },
  { time: "09:40", impact: 1.9, vibration: 0.3 },
  { time: "10:10", impact: 2.8, vibration: 0.6 },
  { time: "10:45", impact: 4.7, vibration: 0.9 },
  { time: "11:20", impact: 3.9, vibration: 1.5 },
  { time: "12:10", impact: 1.6, vibration: 0.8 },
  { time: "13:00", impact: 0.9, vibration: 0.6 },
  { time: "14:20", impact: 1.1, vibration: 1.3 },
  { time: "15:30", impact: 1.4, vibration: 2.1 },
  { time: "17:00", impact: 1.0, vibration: 1.7 },
  { time: "18:30", impact: 0.5, vibration: 0.4 },
] as const;
