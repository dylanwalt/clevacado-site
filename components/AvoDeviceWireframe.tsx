type AvoDeviceWireframeProps = {
  size?: number;
  className?: string;
  tone?: "light" | "dark";
};

export default function AvoDeviceWireframe({
  size = 260,
  className = "",
  tone = "dark",
}: AvoDeviceWireframeProps) {
  const h = Math.round(size * 1.3);
  const stroke = tone === "dark" ? "rgba(255,255,255,0.75)" : "rgba(2,6,23,0.70)";
  const muted = tone === "dark" ? "rgba(255,255,255,0.30)" : "rgba(2,6,23,0.22)";

  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 160 208"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ClevaCado device wireframe"
      role="img"
    >
      {/* Outline body */}
      <path
        d="M 80 8
           C 100 8 122 26 130 56
           C 138 86 134 130 120 152
           C 111 165 49 165 40 152
           C 26 130 22 86 30 56
           C 38 26 60 8 80 8 Z"
        stroke={stroke}
        strokeWidth="2"
      />

      {/* Inner contour */}
      <path
        d="M 80 18
           C 97 18 115 34 122 60
           C 129 86 126 125 113 145
           C 105 156 55 156 47 145
           C 34 125 31 86 38 60
           C 45 34 63 18 80 18 Z"
        stroke={muted}
        strokeWidth="1.5"
      />

      {/* Screen */}
      <rect x="52" y="36" width="56" height="40" rx="7" stroke={stroke} strokeWidth="1.5" />
      <path
        d="M 58 56 L 64 56 L 67 47 L 71 64 L 74 52 L 77 59 L 80 50 L 83 58 L 87 48 L 90 60 L 93 56 L 100 56"
        stroke={tone === "dark" ? "rgba(52,211,153,0.95)" : "rgba(5,150,105,0.95)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="97" cy="42" r="2.5" fill={tone === "dark" ? "rgba(52,211,153,0.9)" : "rgba(5,150,105,0.9)"} />

      {/* LEDs */}
      {[
        { cx: 62, col: "rgba(52,211,153,0.9)" },
        { cx: 80, col: "rgba(250,204,21,0.9)" },
        { cx: 98, col: "rgba(239,68,68,0.9)" },
      ].map((d) => (
        <g key={d.cx}>
          <circle cx={d.cx} cy="90" r="5" fill={d.col} />
          <circle cx={d.cx} cy="90" r="10" fill={d.col} opacity="0.12" />
        </g>
      ))}

      {/* Power / pit */}
      <ellipse cx="80" cy="132" rx="22" ry="14" stroke={stroke} strokeWidth="1.5" />
      <ellipse cx="80" cy="132" rx="13" ry="8" stroke={muted} strokeWidth="1.25" />
      <circle cx="80" cy="132" r="4" fill={tone === "dark" ? "rgba(52,211,153,0.7)" : "rgba(5,150,105,0.7)"} />

      {/* Stem */}
      <rect x="74" y="2" width="12" height="8" rx="3" stroke={muted} strokeWidth="1.25" />
    </svg>
  );
}

