"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion";

/* ─────────────────────────────────────────────────────
   Story chapters
───────────────────────────────────────────────────── */
const SCENES = [
  {
    id: 0,
    number: "01",
    chapter: "ON THE TREE",
    title: "It begins on a tree.",
    body: "Every ClevaCado journey starts at the source — growing alongside real avocados in the orchard, ready to record the entire trip to market.",
    chip: { label: "Journey started", color: "#39D353", bg: "#DCFCE7", textColor: "#166534" },
    bg: "linear-gradient(160deg, #81C784 0%, #4CAF50 45%, #2E7D32 100%)",
    dark: false,
  },
  {
    id: 1,
    number: "02",
    chapter: "THE HARVEST",
    title: "The first moment of contact.",
    body: "Picking is the first handling event. Drops and rough contact at harvest create invisible bruising before the fruit reaches the packhouse.",
    chip: { label: "Impact: 2.1 g detected", color: "#FACC15", bg: "#FEF9C3", textColor: "#78350F" },
    bg: "linear-gradient(160deg, #FFF9C4 0%, #FFECB3 60%, #FFE082 100%)",
    dark: false,
  },
  {
    id: 2,
    number: "03",
    chapter: "THE BINS",
    title: "Into the bins. Stacked. Tipped.",
    body: "Bin tipping and transfer introduce repeated mechanical stress. Each jolt is logged before the fruit ever reaches the sorting line.",
    chip: { label: "Shock: 3.1 g on bin tip", color: "#FB923C", bg: "#FFEDD5", textColor: "#9A3412" },
    bg: "linear-gradient(160deg, #FFF3E0 0%, #FFE0B2 55%, #FFCC80 100%)",
    dark: false,
  },
  {
    id: 3,
    number: "04",
    chapter: "THE PACKHOUSE",
    title: "The packhouse line moves fast.",
    body: "Transfer points on the conveyor are the highest-risk stage. A small drop height change can create sub-surface bruising that won't appear for days.",
    chip: { label: "⚠ Critical drop: 4.8 g", color: "#EF4444", bg: "#FEE2E2", textColor: "#991B1B" },
    bg: "linear-gradient(160deg, #E5E7EB 0%, #D1D5DB 55%, #9CA3AF 100%)",
    dark: false,
  },
  {
    id: 4,
    number: "05",
    chapter: "PACKING",
    title: "Careful hands make the difference.",
    body: "At the packing station, technique matters. ClevaCado identifies which stations handle fruit best — and which ones are the hidden source of losses.",
    chip: { label: "Low impact — good handling", color: "#39D353", bg: "#DCFCE7", textColor: "#166534" },
    bg: "linear-gradient(160deg, #FFFDF7 0%, #FFF8E1 55%, #FFFDE7 100%)",
    dark: false,
  },
  {
    id: 5,
    number: "06",
    chapter: "COLD STORAGE",
    title: "Cold storage isn't always still.",
    body: "Loading onto pallets and refrigerated storage transitions continue to expose fruit to vibration. The damage doesn't stop in the cold room.",
    chip: { label: "Vibration: 12 min above threshold", color: "#0EA5E9", bg: "#E0F2FE", textColor: "#0C4A6E" },
    bg: "linear-gradient(160deg, #BAE6FD 0%, #7DD3FC 45%, #38BDF8 100%)",
    dark: false,
  },
  {
    id: 6,
    number: "07",
    chapter: "THE ROAD",
    title: "Hundreds of kilometres. Hours of vibration.",
    body: "Long-haul transport subjects the fruit to sustained road vibration. ClevaCado records every bump, every turn, and every rough stretch of road.",
    chip: { label: "22 min above threshold", color: "#FB923C", bg: "rgba(251,146,60,0.18)", textColor: "#FB923C" },
    bg: "linear-gradient(160deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
    dark: true,
  },
  {
    id: 7,
    number: "08",
    chapter: "THE SHELF",
    title: "The last few metres.",
    body: "Retail unloading and shelf placement are the final contact points. By now, ClevaCado has a complete record of every handling event along the entire journey.",
    chip: { label: "Data collection complete", color: "#39D353", bg: "#DCFCE7", textColor: "#166534" },
    bg: "linear-gradient(160deg, #F9FAFB 0%, #FFFFFF 50%, #F3F4F6 100%)",
    dark: false,
  },
  {
    id: 8,
    number: "09",
    chapter: "THE RESULT",
    title: "Now producers know exactly where.",
    body: "Instead of guessing, teams receive a precise supply-chain damage map. Three hotspots found. Actions recommended. Quality protected next time.",
    chip: { label: "3 hotspots found • Report ready", color: "#39D353", bg: "#DCFCE7", textColor: "#166534" },
    bg: "linear-gradient(160deg, #DCFCE7 0%, #BBF7D0 40%, #86EFAC 100%)",
    dark: false,
  },
] as const;

/* ─────────────────────────────────────────────────────
   Shared avocado path helper
───────────────────────────────────────────────────── */
function avoD(cx: number, cy: number, s: number) {
  const h = s, w = s * 0.62;
  return `M ${cx} ${cy - h * 0.48}
    C ${cx + w * 0.3} ${cy - h * 0.48} ${cx + w * 0.5} ${cy - h * 0.1} ${cx + w * 0.5} ${cy + h * 0.1}
    C ${cx + w * 0.5} ${cy + h * 0.42} ${cx + w * 0.3} ${cy + h * 0.5} ${cx} ${cy + h * 0.5}
    C ${cx - w * 0.3} ${cy + h * 0.5} ${cx - w * 0.5} ${cy + h * 0.42} ${cx - w * 0.5} ${cy + h * 0.1}
    C ${cx - w * 0.5} ${cy - h * 0.1} ${cx - w * 0.3} ${cy - h * 0.48} ${cx} ${cy - h * 0.48} Z`;
}

/* ClevaCado device icon used inside every scene */
function Device({ cx, cy, s = 72 }: { cx: number; cy: number; s?: number }) {
  const h = s, w = s * 0.62;
  const body = avoD(cx, cy, s);
  const inner = avoD(cx, cy - s * 0.02, s * 0.85);
  const ex = w * 0.2, ey = cy - h * 0.1;
  const sw = Math.max(1.5, s * 0.03);
  return (
    <g>
      {/* Glow ring */}
      <path d={avoD(cx, cy, s * 1.35)} fill="#39D353" opacity="0.12" />
      {/* Body */}
      <path d={body} fill="#39D353" />
      <path d={inner} fill="#F0FFF4" opacity="0.9" />
      {/* Screen */}
      <rect
        x={cx - w * 0.3} y={cy - h * 0.35}
        width={w * 0.6} height={h * 0.28}
        rx={s * 0.055} fill="#1F2937"
      />
      {/* Waveform */}
      <path
        d={`M ${cx - w * 0.24} ${cy - h * 0.21}
            l ${w * 0.09} 0 l ${w * 0.05} -${h * 0.09}
            l ${w * 0.05} ${h * 0.14} l ${w * 0.05} -${h * 0.07}
            l ${w * 0.05} ${h * 0.06} l ${w * 0.09} 0`}
        stroke="#39D353" strokeWidth={sw} fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />
      {/* LED dots */}
      <circle cx={cx - w * 0.18} cy={cy} r={s * 0.055} fill="#39D353" />
      <circle cx={cx} cy={cy} r={s * 0.055} fill="#FACC15" />
      <circle cx={cx + w * 0.18} cy={cy} r={s * 0.055} fill="#EF4444" />
      {/* Pit */}
      <ellipse cx={cx} cy={cy + h * 0.3} rx={w * 0.3} ry={h * 0.18} fill="#166534" opacity="0.8" />
      {/* Eyes */}
      <circle cx={cx - ex} cy={ey} r={s * 0.07} fill="#1F2937" opacity="0.7" />
      <circle cx={cx + ex} cy={ey} r={s * 0.07} fill="#1F2937" opacity="0.7" />
      {/* Smile */}
      <path
        d={`M ${cx - ex * 0.9} ${cy - h * 0.04} Q ${cx} ${cy + h * 0.06} ${cx + ex * 0.9} ${cy - h * 0.04}`}
        stroke="#1F2937" strokeWidth={sw * 0.9} strokeLinecap="round" fill="none" opacity="0.6"
      />
    </g>
  );
}

/* ─────────────────────────────────────────────────────
   Scene illustrations — device-centric, max 6 elements
───────────────────────────────────────────────────── */
const SVG = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 800 460" width="100%" height="100%"
    style={{ maxHeight: "100%", maxWidth: "100%", display: "block" }}
    aria-hidden="true">
    {children}
  </svg>
);

function S0_Tree() {
  return (
    <SVG>
      {/* Ground */}
      <rect x="0" y="390" width="800" height="70" fill="#1B5E20" rx="0" />
      <ellipse cx="400" cy="390" rx="320" ry="22" fill="#2E7D32" />
      {/* Sun */}
      <circle cx="660" cy="68" r="52" fill="#FFD54F" opacity="0.9" />
      <circle cx="660" cy="68" r="76" fill="#FFD54F" opacity="0.15" />
      {/* Trunk */}
      <rect x="374" y="252" width="52" height="145" rx="8" fill="#4E342E" />
      {/* Canopy layers */}
      <circle cx="400" cy="198" r="182" fill="#1B5E20" />
      <circle cx="400" cy="178" r="162" fill="#2E7D32" />
      <circle cx="370" cy="155" r="110" fill="#388E3C" opacity="0.7" />
      <circle cx="430" cy="165" r="105" fill="#43A047" opacity="0.5" />
      {/* Avocados in canopy */}
      <path d={avoD(310, 240, 46)} fill="#33691E" />
      <path d={avoD(480, 230, 44)} fill="#33691E" />
      <path d={avoD(340, 178, 40)} fill="#388E3C" opacity="0.7" />
      <path d={avoD(462, 185, 38)} fill="#388E3C" opacity="0.7" />
      {/* Device — prominent, centered, last (on top) */}
      <Device cx={400} cy={202} s={92} />
    </SVG>
  );
}

function S1_Harvest() {
  return (
    <SVG>
      {/* Sky warmth at bottom */}
      <rect x="0" y="380" width="800" height="80" fill="#F9A825" opacity="0.3" />
      {/* Tree branch */}
      <path d="M -10 130 Q 200 105 380 140 Q 520 170 820 110" stroke="#5D4037" strokeWidth="42" strokeLinecap="round" fill="none" />
      <path d="M -10 130 Q 200 105 380 140 Q 520 170 820 110" stroke="#6D4C41" strokeWidth="28" strokeLinecap="round" fill="none" />
      {/* Leaves */}
      {([[220, 95, -18], [320, 115, 12], [440, 148, -8], [560, 125, 16], [160, 108, 8]] as [number, number, number][]).map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={32} ry={14} fill="#388E3C" transform={`rotate(${r},${x},${y})`} opacity="0.85" />
      ))}
      {/* Arm from bottom */}
      <path d="M 400 480 Q 400 360 400 240" stroke="#D7CCC8" strokeWidth="64" strokeLinecap="round" fill="none" />
      <path d="M 400 480 Q 400 360 400 240" stroke="#EFEBE9" strokeWidth="48" strokeLinecap="round" fill="none" />
      {/* Impact rings around device */}
      <circle cx="400" cy="175" r="68" fill="none" stroke="#FACC15" strokeWidth="3" opacity="0.65" />
      <circle cx="400" cy="175" r="96" fill="none" stroke="#FACC15" strokeWidth="2" opacity="0.35" />
      <circle cx="400" cy="175" r="124" fill="none" stroke="#FACC15" strokeWidth="1.5" opacity="0.18" />
      {/* Device */}
      <Device cx={400} cy={174} s={96} />
    </SVG>
  );
}

function S2_Bins() {
  return (
    <SVG>
      {/* Ground */}
      <rect x="0" y="400" width="800" height="60" fill="#BDBDBD" />
      {/* Bin 1 — upright */}
      <rect x="70" y="210" width="230" height="195" rx="12" fill="#90A4AE" />
      <rect x="70" y="210" width="230" height="18" rx="8" fill="#B0BEC5" />
      {/* Avocados in bin 1 */}
      {([[150, 375], [195, 370], [240, 376], [162, 330], [210, 326], [255, 332]]).map(([x, y], i) => (
        <path key={i} d={avoD(x, y, 40)} fill={i % 2 === 0 ? "#558B2F" : "#4CAF50"} />
      ))}
      {/* Bin 2 — tilting, avocados spilling */}
      <g transform="rotate(-20, 530, 380)">
        <rect x="420" y="205" width="220" height="195" rx="12" fill="#78909C" />
        <rect x="420" y="205" width="220" height="18" rx="8" fill="#90A4AE" />
        {([[475, 370], [520, 365], [565, 372]]).map(([x, y], i) => (
          <path key={i} d={avoD(x, y, 38)} fill={i % 2 === 0 ? "#558B2F" : "#4CAF50"} />
        ))}
      </g>
      {/* Spilling avocados */}
      <path d={avoD(620, 336, 38)} fill="#4CAF50" />
      <path d={avoD(656, 372, 35)} fill="#558B2F" />
      <path d={avoD(598, 378, 33)} fill="#66BB6A" />
      {/* Shock flash lines */}
      {([[605, 320], [625, 305], [645, 315]]).map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2={x + (i - 1) * 14} y2={y - 18} stroke="#FB923C" strokeWidth="3" strokeLinecap="round" />
      ))}
      {/* Device visible in bin 1 — prominent */}
      <Device cx={183} cy={298} s={82} />
    </SVG>
  );
}

function S3_Packhouse() {
  return (
    <SVG>
      {/* Back wall */}
      <rect x="0" y="0" width="800" height="460" fill="#E5E7EB" />
      {/* Ceiling strip */}
      <rect x="0" y="0" width="800" height="90" fill="#D1D5DB" />
      {/* Lights */}
      {([100, 300, 500, 700]).map((x, i) => (
        <g key={i}>
          <rect x={x - 44} y={14} width={88} height={16} rx={5} fill="#FEF9C3" />
          <ellipse cx={x} cy={36} rx={60} ry={24} fill="#FEFCE8" opacity={0.22} />
        </g>
      ))}
      {/* Main conveyor belt */}
      <rect x="0" y="290" width="800" height="56" rx="6" fill="#4B5563" />
      <rect x="0" y="292" width="800" height="8" rx="3" fill="#6B7280" opacity="0.5" />
      {/* Rollers */}
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={i * 52} y={288} width={12} height={60} rx={6} fill="#374151" />
      ))}
      {/* Upper conveyor at different height (transfer point) */}
      <rect x="450" y="220" width="240" height="44" rx="5" fill="#374151" />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={454 + i * 50} y={218} width={12} height={48} rx={6} fill="#1F2937" />
      ))}
      {/* Avocados on lower belt */}
      <path d={avoD(100, 278, 46)} fill="#558B2F" />
      <path d={avoD(210, 276, 44)} fill="#4CAF50" />
      <path d={avoD(330, 280, 46)} fill="#558B2F" />
      {/* Drop point — red hazard indicator */}
      <circle cx="460" cy="294" r="20" fill="#EF4444" opacity="0.18" />
      <circle cx="460" cy="294" r="12" fill="#EF4444" opacity="0.35" />
      {/* Drop arrow */}
      <path d="M 460 238 L 460 272" stroke="#EF4444" strokeWidth="3.5" strokeDasharray="5 3" strokeLinecap="round" />
      <path d="M 450 266 L 460 278 L 470 266" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Device — at the drop point, falling */}
      <g transform="rotate(12, 460, 250)">
        <Device cx={460} cy={248} s={82} />
      </g>
      {/* Floor */}
      <rect x="0" y="380" width="800" height="80" fill="#9CA3AF" />
    </SVG>
  );
}

function S4_Packing() {
  return (
    <SVG>
      {/* Table */}
      <rect x="0" y="340" width="800" height="120" fill="#D7CCC8" />
      <rect x="0" y="335" width="800" height="10" rx="0" fill="#BCAAA4" />
      {/* Open cardboard box — large, prominent */}
      {/* Back */}
      <rect x="180" y="160" width="440" height="200" rx="8" fill="#D7AC6A" />
      {/* Left flap open */}
      <path d="M 180 160 Q 110 138 68 108 L 68 310 L 180 310 Z" fill="#C49A4F" opacity="0.85" />
      {/* Right flap open */}
      <path d="M 620 160 Q 692 132 732 100 L 732 310 L 620 310 Z" fill="#C49A4F" opacity="0.85" />
      {/* Front lower */}
      <rect x="180" y="295" width="440" height="65" rx="4" fill="#A0784A" />
      {/* Inside tissue */}
      <ellipse cx="400" cy="180" rx="200" ry="28" fill="#FFFDE7" opacity="0.5" />
      {/* Avocados inside */}
      {([[255, 262], [315, 258], [375, 260], [435, 257], [495, 260], [555, 263]]).map(([x, y], i) => (
        <path key={i} d={avoD(x, y, 44)} fill={i % 2 === 0 ? "#558B2F" : "#4CAF50"} />
      ))}
      {/* Device — prominent inside box, highlighted */}
      <Device cx={400} cy={214} s={86} />
      {/* Hand reaching in */}
      <path d="M 680 460 Q 660 380 610 310 Q 580 270 550 248" stroke="#EFEBE9" strokeWidth="52" strokeLinecap="round" fill="none" />
      <path d="M 680 460 Q 660 380 610 310 Q 580 270 550 248" stroke="#F5F5F0" strokeWidth="38" strokeLinecap="round" fill="none" />
      <circle cx="545" cy="240" r="28" fill="#F5F5F0" />
    </SVG>
  );
}

function S5_ColdStorage() {
  return (
    <SVG>
      {/* Floor */}
      <rect x="0" y="400" width="800" height="60" fill="#90A4AE" />
      {/* Shelving back panel */}
      <rect x="40" y="60" width="720" height="345" rx="6" fill="#B0BEC5" opacity="0.35" />
      {/* Shelf boards — 3 rows */}
      {([70, 195, 320]).map((y, si) => (
        <g key={si}>
          <rect x={40} y={y} width={720} height={16} rx={3} fill="#78909C" />
          <rect x={40} y={y} width={720} height={5} fill="#546E7A" opacity="0.5" />
        </g>
      ))}
      {/* Uprights */}
      {([40, 280, 520, 756]).map((x, i) => (
        <rect key={i} x={x} y={60} width={8} height={345} rx={3} fill="#607D8B" />
      ))}
      {/* Boxes on shelves — rows */}
      {[
        [[60, 48], [170, 48], [300, 48], [410, 48], [540, 48], [650, 48]],
        [[60, 48], [170, 48], [300, 48], [540, 48], [650, 48]],
        [[60, 48], [170, 48], [300, 48], [410, 48], [650, 48]],
      ].map((row, ri) =>
        row.map(([x, w], bi) => (
          <rect key={`${ri}-${bi}`} x={x} y={[86, 211, 336][ri]} width={w} height={40} rx={4}
            fill={ri === 0 ? "#B3E5FC" : ri === 1 ? "#81D4FA" : "#E1F5FE"}
            stroke="#80DEEA" strokeWidth={1} />
        ))
      )}
      {/* Device on middle shelf — prominently lit */}
      <Device cx={460} cy={258} s={80} />
      {/* Temperature badge */}
      <rect x="620" y="78" width="116" height="54" rx="10" fill="#E0F7FA" stroke="#4DD0E1" strokeWidth="1.5" />
      <text x="678" y="101" textAnchor="middle" fontSize="13" fill="#006064" fontWeight="700" letterSpacing="1">TEMP</text>
      <text x="678" y="122" textAnchor="middle" fontSize="22" fill="#00838F" fontWeight="800">4 °C</text>
      {/* Frost crystals */}
      {([[55, 52], [748, 70], [40, 210], [755, 230], [40, 370], [755, 360]]).map(([x, y], i) => (
        <g key={i} transform={`translate(${x},${y})`} opacity={0.55}>
          <line x1="-13" y1="0" x2="13" y2="0" stroke="#B3E5FC" strokeWidth="2" />
          <line x1="0" y1="-13" x2="0" y2="13" stroke="#B3E5FC" strokeWidth="2" />
          <line x1="-9" y1="-9" x2="9" y2="9" stroke="#B3E5FC" strokeWidth="1.5" />
          <line x1="9" y1="-9" x2="-9" y2="9" stroke="#B3E5FC" strokeWidth="1.5" />
        </g>
      ))}
    </SVG>
  );
}

function S6_Road() {
  return (
    <SVG>
      {/* Night sky */}
      <rect x="0" y="0" width="800" height="300" fill="#0F172A" />
      {/* Stars */}
      {([
        [80, 28], [160, 55], [250, 22], [360, 44], [440, 14], [520, 52],
        [610, 24], [710, 48], [50, 95], [300, 78], [550, 72], [730, 98],
        [140, 135], [460, 118], [680, 142],
      ]).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.5 : 1.5} fill="white" opacity={0.65 + (i % 4) * 0.1} />
      ))}
      {/* Moon */}
      <circle cx="670" cy="62" r="38" fill="#FEF9C3" opacity="0.88" />
      <circle cx="684" cy="54" r="32" fill="#1E293B" />
      {/* Hills */}
      <path d="M 0 275 Q 120 210 240 250 Q 360 185 480 228 Q 600 168 720 205 Q 770 178 800 195 L 800 310 L 0 310 Z" fill="#1E293B" />
      {/* Road */}
      <rect x="0" y="295" width="800" height="165" fill="#1F2937" />
      <rect x="0" y="295" width="800" height="4" fill="#374151" />
      {/* Road centre dashes */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={i * 90 + 8} y={364} width={62} height={9} rx={4} fill="#FACC15" opacity={0.75} />
      ))}
      {/* Motion blur lines (left of truck) */}
      {([318, 332, 344, 356, 368, 380, 392]).map((y, i) => (
        <line key={i} x1="0" y1={y} x2={120 + i * 14} y2={y} stroke="#374151" strokeWidth={i < 3 ? 1 : 2} opacity={0.45} />
      ))}
      {/* Truck trailer */}
      <rect x="120" y="262" width="390" height="148" rx="7" fill="#1E293B" />
      <rect x="124" y="266" width="382" height="140" rx="5" fill="#334155" />
      {/* Trailer door seam */}
      <line x1="512" y1="270" x2="512" y2="406" stroke="#0F172A" strokeWidth="3.5" />
      {/* Truck cab */}
      <path d="M 510 262 L 648 262 L 680 294 L 692 316 L 692 410 L 510 410 Z" fill="#0F172A" />
      <path d="M 516 268 L 635 268 L 663 295 L 674 315 L 674 370 L 516 370 Z" fill="#1F2937" />
      {/* Windshield */}
      <path d="M 525 273 L 623 273 L 648 298 L 525 298 Z" fill="#0EA5E9" opacity="0.28" />
      <line x1="586" y1="273" x2="586" y2="298" stroke="#0F172A" strokeWidth="2.5" />
      {/* Headlights */}
      <rect x="682" y="324" width="22" height="18" rx="3" fill="#FEF9C3" />
      <path d="M 704 333 L 760 308 L 760 352 L 704 342 Z" fill="#FFFBEB" opacity="0.14" />
      {/* Wheels */}
      {([210, 360, 490, 608, 650]).map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={410} r={i > 2 ? 28 : 32} fill="#0F172A" />
          <circle cx={x} cy={410} r={i > 2 ? 18 : 20} fill="#1E293B" />
          <circle cx={x} cy={410} r={i > 2 ? 7 : 9} fill="#334155" />
        </g>
      ))}
      {/* Device visible through trailer */}
      <Device cx={320} cy={336} s={84} />
    </SVG>
  );
}

function S7_Shelf() {
  return (
    <SVG>
      {/* Vertical section dividers */}
      {([0, 268, 536, 800]).map((x, i) => (
        <rect key={i} x={x} y="0" width="7" height="460" fill="#E5E7EB" />
      ))}
      {/* Ceiling lighting */}
      <rect x="0" y="0" width="800" height="24" fill="#E5E7EB" />
      {([80, 220, 380, 540, 700]).map((x, i) => (
        <rect key={i} x={x - 32} y={5} width={64} height={13} rx={5} fill="#FEF9C3" />
      ))}
      {/* 3 shelf boards */}
      {([100, 240, 380]).map((y, si) => (
        <g key={si}>
          <rect x={0} y={y} width={800} height={18} rx={2} fill="#D1D5DB" />
          <rect x={0} y={y} width={800} height={5} fill="#9CA3AF" />
          {/* Price strip */}
          <rect x={0} y={y + 18} width={800} height={16} fill="#F3F4F6" />
        </g>
      ))}
      {/* Avocados — neat rows on each shelf */}
      {([100, 240, 380]).map((shelfY, si) =>
        ([60, 115, 170, 225, 280, 335, 390, 445, 500, 555, 610, 665, 720]).map((x, ai) => (
          <path key={`${si}-${ai}`} d={avoD(x, shelfY - 10, 38)} fill={ai % 2 === 0 ? "#4CAF50" : "#558B2F"} />
        ))
      )}
      {/* Device — prominent on middle shelf with glow */}
      <path d={avoD(400, 228, 76)} fill="#39D353" opacity="0.12" />
      <path d={avoD(400, 228, 96)} fill="#39D353" opacity="0.06" />
      <Device cx={400} cy={226} s={80} />
      {/* Floor */}
      <rect x="0" y="440" width="800" height="20" fill="#E5E7EB" />
    </SVG>
  );
}

function S8_Result() {
  return (
    <SVG>
      {/* Cutting board */}
      <rect x="120" y="230" width="380" height="210" rx="16" fill="#D7B896" />
      <rect x="128" y="238" width="364" height="195" rx="12" fill="#C8A882" opacity="0.35" />
      {/* Avocado halves */}
      {/* Left half */}
      <path d={avoD(240, 330, 120)} fill="#4CAF50" />
      <path d={avoD(240, 330, 108)} fill="#DCEDC8" />
      <ellipse cx="240" cy="340" rx="36" ry="44" fill="#8D6E63" />
      <ellipse cx="237" cy="336" rx="18" ry="24" fill="#A1887F" opacity="0.55" />
      {/* Right half */}
      <path d={avoD(370, 328, 108)} fill="#4CAF50" />
      <path d={avoD(370, 328, 97)} fill="#DCEDC8" />
      <ellipse cx="370" cy="338" rx="32" ry="38" fill="#C8E6C9" opacity="0.85" />
      {/* Knife */}
      <rect x="482" y="248" width="14" height="210" rx="4" fill="#BDBDBD" />
      <rect x="484" y="250" width="6" height="208" rx="3" fill="#E0E0E0" opacity="0.7" />
      <rect x="481" y="238" width="17" height="14" rx="3" fill="#795548" />
      <rect x="481" y="224" width="17" height="16" rx="2" fill="#6D4C41" />
      {/* Report card — large text, readable */}
      <rect x="520" y="148" width="248" height="252" rx="14"
        fill="white" stroke="#39D353" strokeWidth="1.5" strokeOpacity="0.35"
        style={{ filter: "drop-shadow(0 6px 24px rgba(57,211,83,0.18))" }} />
      {/* Card header */}
      <rect x="520" y="148" width="248" height="42" rx="14" fill="#DCFCE7" />
      <rect x="520" y="176" width="248" height="14" fill="#DCFCE7" />
      <text x="644" y="175" textAnchor="middle" fontSize="12" fill="#166534" fontWeight="800" letterSpacing="1.2">REPORT READY</text>
      {/* Divider */}
      <line x1="536" y1="198" x2="752" y2="198" stroke="#F0FDF4" strokeWidth="1.5" />
      {/* Report rows — readable font sizes */}
      {([
        ["Hotspots found", "3", "#EF4444"],
        ["Worst stage", "Sorting", "#FB923C"],
        ["Peak impact", "4.8 g", "#FACC15"],
        ["Recommendation", "See report →", "#39D353"],
      ] as [string, string, string][]).map(([label, val, col], i) => (
        <g key={i}>
          <text x="536" y={220 + i * 42} fontSize="11.5" fill="#9CA3AF" fontWeight="600">{label}</text>
          <text x="752" y={220 + i * 42} fontSize="13.5" fill={col} fontWeight="800" textAnchor="end">{val}</text>
          <line x1="536" y1={228 + i * 42} x2="752" y2={228 + i * 42} stroke="#F3F4F6" strokeWidth="1.5" />
        </g>
      ))}
      {/* Quality badge */}
      <rect x="534" y="370" width="220" height="24" rx="7" fill="#DCFCE7" />
      <text x="644" y="386" fontSize="11.5" fill="#166534" fontWeight="800" textAnchor="middle">✓  Quality protected this time</text>
      {/* Device — left side, connected */}
      <Device cx={80} cy={310} s={76} />
      {/* Data line from device to card */}
      <path d="M 118 290 Q 250 240 520 220" stroke="#39D353" strokeWidth="1.5" strokeDasharray="7 5" opacity="0.45" />
    </SVG>
  );
}

const SCENE_COMPS = [S0_Tree, S1_Harvest, S2_Bins, S3_Packhouse, S4_Packing, S5_ColdStorage, S6_Road, S7_Shelf, S8_Result];

/* ─────────────────────────────────────────────────────
   Main section component
───────────────────────────────────────────────────── */
export default function JourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(SCENES.length - 1, Math.floor(v * SCENES.length + 0.015)));
  });

  const scene = SCENES[active];
  const SceneComp = SCENE_COMPS[active];

  const jumpTo = (i: number) => {
    if (!containerRef.current) return;
    const top = containerRef.current.offsetTop;
    window.scrollTo({ top: top + i * window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      id="journey"
      ref={containerRef}
      style={{ height: `${SCENES.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">

        {/* Background per scene */}
        {SCENES.map((s, i) => (
          <div
            key={s.id}
            aria-hidden="true"
            className="absolute inset-0 transition-[opacity] duration-[600ms] ease-in-out"
            style={{ background: s.bg, opacity: active === i ? 1 : 0 }}
          />
        ))}

        {/* Illustration */}
        <div className="absolute inset-0 flex items-start justify-center"
          style={{ paddingTop: 76, paddingBottom: 220, paddingLeft: 16, paddingRight: 16 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ width: "100%", height: "100%", maxWidth: 900, display: "flex", alignItems: "center" }}
            >
              <SceneComp />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Chapter label — top left */}
        <div className="absolute z-20 pointer-events-none"
          style={{ top: 84, left: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div key={`ch-${active}`}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.3 }}>
              <p className="text-[11px] font-black tracking-[0.2em] uppercase mb-1"
                style={{ color: scene.dark ? "rgba(255,255,255,0.45)" : "#9CA3AF" }}>
                The Journey &nbsp;·&nbsp; {scene.number} / {String(SCENES.length).padStart(2, "0")}
              </p>
              <p className="text-sm font-black tracking-[0.14em] uppercase"
                style={{ color: scene.dark ? "rgba(255,255,255,0.9)" : "#374151" }}>
                {scene.chapter}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Data chip — top right */}
        <div className="absolute z-20 pointer-events-none"
          style={{ top: 84, right: 24 }}>
          <AnimatePresence mode="wait">
            <motion.div key={`chip-${active}`}
              initial={{ opacity: 0, x: 12, scale: 0.88 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.38, delay: 0.18 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: scene.chip.bg,
                border: `1px solid ${scene.chip.color}28`,
                color: scene.chip.textColor,
                boxShadow: `0 2px 12px ${scene.chip.color}22`,
              }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
                style={{ background: scene.chip.color }} />
              {scene.chip.label}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom narrative card */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="h-14 pointer-events-none" aria-hidden="true"
            style={{
              background: scene.dark
                ? "linear-gradient(0deg, rgba(15,23,42,0.98) 0%, transparent 100%)"
                : "linear-gradient(0deg, rgba(255,255,255,0.98) 0%, transparent 100%)",
            }} />
          <div className="px-5 md:px-12 pt-1 pb-6"
            style={{
              background: scene.dark ? "rgba(15,23,42,0.97)" : "rgba(255,255,255,0.97)",
              backdropFilter: "blur(14px)",
            }}>
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div key={`text-${active}`}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
                  <h2 className="text-2xl md:text-3xl font-extrabold leading-snug mb-2"
                    style={{ color: scene.dark ? "white" : "#1F2937" }}>
                    {scene.title}
                  </h2>
                  <p className="text-[15px] md:text-base leading-relaxed"
                    style={{ color: scene.dark ? "rgba(255,255,255,0.65)" : "#6B7280" }}>
                    {scene.body}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex items-center gap-2.5 mt-4" role="tablist">
                {SCENES.map((_, i) => (
                  <button key={i} role="tab"
                    aria-selected={i === active}
                    aria-label={`${SCENES[i].number}: ${SCENES[i].chapter}`}
                    onClick={() => jumpTo(i)}
                    className="rounded-full transition-all focus:outline-none"
                    style={{
                      width: i === active ? 28 : 8, height: 8,
                      background: i === active ? "#39D353"
                        : scene.dark ? "rgba(255,255,255,0.2)" : "#D1D5DB",
                      transitionDuration: "300ms",
                    }} />
                ))}
                <span className="ml-1 text-xs font-medium"
                  style={{ color: scene.dark ? "rgba(255,255,255,0.35)" : "#9CA3AF" }}
                  aria-hidden="true">
                  Scroll to advance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
