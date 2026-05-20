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

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export const JOURNEY_STAGES = [
  {
    id: 0,
    number: "01",
    label: "Harvesting",
    short: "Harvest",
    icon: "🌿",
    description:
      "Drops, knocks, and rough picking can create early bruising risk before fruit even reaches the packhouse.",
    measurement:
      "ClevaCado records impact events and handling shocks at the source.",
    insight:
      "High-impact picking moments are logged with timestamps and severity.",
    riskLevel: "moderate" as RiskLevel,
    riskColor: "#FACC15",
    event: "Impact: 2.1 g at point of pick",
  },
  {
    id: 1,
    number: "02",
    label: "Bin Handling",
    short: "Bins",
    icon: "📦",
    description:
      "Stacking, tipping, and transfer points can introduce repeated mechanical stress before sorting begins.",
    measurement:
      "ClevaCado identifies high-impact handling moments before they become quality losses.",
    insight:
      "Bin tipping events cause repeated moderate shocks — a known bruising risk.",
    riskLevel: "high" as RiskLevel,
    riskColor: "#FB923C",
    event: "Shock: 3.1 g on bin tip",
  },
  {
    id: 2,
    number: "03",
    label: "Sorting Line",
    short: "Sorting",
    icon: "⚙️",
    description:
      "Conveyors and transfer points can expose fruit to vibration, rotation, and sudden drops.",
    measurement:
      "ClevaCado maps motion patterns and vibration exposure across the packhouse line.",
    insight:
      "Transfer-point drops of 4–8 cm are a leading cause of sub-surface bruising.",
    riskLevel: "critical" as RiskLevel,
    riskColor: "#EF4444",
    event: "Drop: 4.8 cm at transfer point",
  },
  {
    id: 3,
    number: "04",
    label: "Packing",
    short: "Packing",
    icon: "🗃️",
    description:
      "Small handling changes at the packing stage can affect whether fruit arrives in premium condition.",
    measurement:
      "ClevaCado helps teams identify where process improvements will matter most.",
    insight:
      "Gentle packing technique significantly reduces cumulative bruising score.",
    riskLevel: "low" as RiskLevel,
    riskColor: "#39D353",
    event: "Low impact — good handling",
  },
  {
    id: 4,
    number: "05",
    label: "Cold Storage",
    short: "Storage",
    icon: "❄️",
    description:
      "Movement during storage loading and pallet rearrangement can still create damage risk.",
    measurement:
      "ClevaCado tracks handling stress and vibration during storage transitions.",
    insight:
      "Pallet-stacking vibration during refrigerated loading is measurable and reducible.",
    riskLevel: "moderate" as RiskLevel,
    riskColor: "#FACC15",
    event: "Vibration: 12 min above threshold",
  },
  {
    id: 5,
    number: "06",
    label: "Transport",
    short: "Transport",
    icon: "🚛",
    description:
      "Long-duration vibration and repeated road shocks can reduce fruit quality before arrival.",
    measurement:
      "ClevaCado records vibration exposure and route-level handling risk over time.",
    insight:
      "22 minutes of above-threshold vibration detected during highway transit.",
    riskLevel: "high" as RiskLevel,
    riskColor: "#FB923C",
    event: "Vibration: 22 min above threshold",
  },
  {
    id: 6,
    number: "07",
    label: "Market Arrival",
    short: "Market",
    icon: "🏪",
    description:
      "Instead of guessing where bruising happened, producers receive a clear damage-risk profile.",
    measurement:
      "ClevaCado helps protect quality and enables targeted improvements from farm to market.",
    insight:
      "Full supply-chain damage profile delivered — hotspots identified, actions recommended.",
    riskLevel: "low" as RiskLevel,
    riskColor: "#39D353",
    event: "Report ready — 3 hotspots found",
  },
] as const;

export const SENSOR_FEATURES = [
  {
    id: 0,
    title: "Impact-Event Detection",
    description:
      "Detects sudden shocks and drops that can contribute to bruising, logging the time, magnitude, and duration of each event.",
    icon: "⚡",
    metric: "Up to 16 g range",
    color: "#39D353",
  },
  {
    id: 1,
    title: "Vibration Exposure Tracking",
    description:
      "Measures repeated movement during conveyors, loading, cold storage, and transport to quantify cumulative mechanical stress.",
    icon: "〰️",
    metric: "3-axis sensing",
    color: "#22C55E",
  },
  {
    id: 2,
    title: "Rotational Motion Sensing",
    description:
      "Uses gyroscopic data to understand tumbling, rolling, and orientation changes that affect how bruising forces are distributed.",
    icon: "🔄",
    metric: "360° rotation",
    color: "#15803D",
  },
  {
    id: 3,
    title: "Damage-Risk Profiling",
    description:
      "Converts raw inertial measurement data into clear, stage-by-stage supply-chain handling insights and risk scores.",
    icon: "📊",
    metric: "Per-stage scoring",
    color: "#39D353",
  },
] as const;

export const IMPACT_CARDS = [
  {
    id: 0,
    title: "Reduce Post-Harvest Losses",
    description:
      "Identify damage hotspots before they become repeated, invisible quality losses.",
    icon: "📉",
  },
  {
    id: 1,
    title: "Improve Marketable Yield",
    description:
      "Help more avocados reach customers in premium condition by fixing the right problems.",
    icon: "🥑",
  },
  {
    id: 2,
    title: "Support Food Quality",
    description:
      "Give teams better evidence to protect freshness, consistency, and shelf life.",
    icon: "✅",
  },
  {
    id: 3,
    title: "Empower Farmers with Data",
    description:
      "Replace guesswork with measurable supply-chain diagnostics that point to real solutions.",
    icon: "📱",
  },
  {
    id: 4,
    title: "Reduce Food Waste",
    description:
      "Protect more produce from farm to market — less bruising means less waste.",
    icon: "♻️",
  },
  {
    id: 5,
    title: "Enable Better Processes",
    description:
      "Give workers and managers clearer tools to improve handling quality at every stage.",
    icon: "🔧",
  },
] as const;

export const DASHBOARD_CHART_DATA = [
  { time: "09:00", impact: 0.2, vibration: 0.1, stage: "Harvest" },
  { time: "09:30", impact: 2.1, vibration: 0.3, stage: "Harvest" },
  { time: "10:15", impact: 3.1, vibration: 0.5, stage: "Bins" },
  { time: "10:45", impact: 4.8, vibration: 0.8, stage: "Sorting" },
  { time: "11:30", impact: 1.2, vibration: 1.4, stage: "Sorting" },
  { time: "12:00", impact: 0.4, vibration: 0.6, stage: "Packing" },
  { time: "13:00", impact: 0.3, vibration: 0.4, stage: "Packing" },
  { time: "14:00", impact: 0.8, vibration: 1.8, stage: "Storage" },
  { time: "15:30", impact: 1.1, vibration: 2.4, stage: "Transport" },
  { time: "17:00", impact: 0.5, vibration: 1.6, stage: "Transport" },
  { time: "18:30", impact: 0.3, vibration: 0.2, stage: "Market" },
] as const;
