export const COLORS = {
  cream: "#FAF8EF",
  warmWhite: "#FFFDF7",
  avocadoGreen: "#5ED143",
  limeGlow: "#B7FF5A",
  deepAvocado: "#174D2A",
  leafGreen: "#2F8F46",
  charcoal: "#162118",
  mutedText: "#5E6B61",
  softSage: "#EAF5E5",
  sand: "#EFE8D2",
  riskAmber: "#F6B73C",
  riskOrange: "#F97316",
  riskRed: "#EF4444",
} as const;

export const CONTACT_EMAIL = "hello@clevacado.com";

export const RISK_META = {
  low: {
    label: "Low",
    color: COLORS.leafGreen,
    soft: "#EEF8EA",
  },
  moderate: {
    label: "Moderate",
    color: COLORS.riskAmber,
    soft: "#FFF3D8",
  },
  high: {
    label: "High",
    color: COLORS.riskOrange,
    soft: "#FFE7D7",
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
  "Hotspot found",
] as const;

export type JourneyChapter = {
  id: string;
  number: string;
  title: string;
  short: string;
  risk: string;
  event: string;
  action: string;
  riskLevel: RiskLevel;
  position: {
    x: number;
    y: number;
  };
};

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
      "Early impact events logged at the source.",
    insight:
      "The first handling moments already shape downstream fruit quality.",
    event: "2.1 g impact at point of pick",
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
      "High-impact handling moments logged during bin transfer.",
    insight:
      "Repeated shocks accumulate long before bruising becomes visible.",
    event: "3.1 g shock during bin tipping",
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
      "Transfer-line motion pattern mapped clearly.",
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
      "Packing transitions recorded for risk comparison.",
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
      "Cold-chain movement logged during storage transitions.",
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
      "Route-level vibration exposure tracked continuously.",
    insight:
      "Transport is stable overall, but sustained vibration still adds pressure to fruit quality.",
    event: "22 minutes above vibration target",
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
      "Farm-to-market diagnostics report generated.",
    insight:
      "The run closes with one clear instruction: fix the sorting transfer line first.",
    event: "Farm-to-market report generated",
    riskLevel: "low",
    score: 18,
    position: { x: 90, y: 8 },
  },
];

export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  {
    id: "harvest",
    number: "01",
    title: "Harvest",
    short: "Harvest",
    risk: "Early knocks start hidden damage.",
    event: "Detected: 2.1 g picking impact.",
    action: "Action: improve early handling.",
    riskLevel: "moderate",
    position: { x: 12, y: 80 },
  },
  {
    id: "bins",
    number: "02",
    title: "Bins",
    short: "Bins",
    risk: "Tipping amplifies mechanical stress.",
    event: "Detected: 3.1 g bin shock.",
    action: "Action: soften transfer points.",
    riskLevel: "high",
    position: { x: 28, y: 62 },
  },
  {
    id: "sorting",
    number: "03",
    title: "Sorting",
    short: "Sorting",
    risk: "The transfer line is the hotspot.",
    event: "Detected: shock at 10:45.",
    action: "Action: reduce handoff height.",
    riskLevel: "critical",
    position: { x: 49, y: 44 },
  },
  {
    id: "transport",
    number: "04",
    title: "Transport",
    short: "Transport",
    risk: "Long vibration affects fruit quality.",
    event: "Detected: 22 minutes above target.",
    action: "Action: review route handling.",
    riskLevel: "high",
    position: { x: 72, y: 27 },
  },
  {
    id: "report",
    number: "05",
    title: "Report",
    short: "Report",
    risk: "The fix is now visible.",
    event: "Hotspot: packhouse transfer line.",
    action: "Action: adjust process and retest.",
    riskLevel: "low",
    position: { x: 90, y: 12 },
  },
] as const;

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
