interface AvoDeviceProps {
  size?: number;
  className?: string;
}

export default function AvoDevice({ size = 200, className = "" }: AvoDeviceProps) {
  const h = Math.round(size * 1.3);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 160 208"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ClevaCado smart sensor device"
      role="img"
    >
      <defs>
        <linearGradient id={`dg-${size}`} x1="30" y1="8" x2="140" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
        <filter id={`glow-${size}`}>
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Drop shadow */}
      <ellipse cx="80" cy="200" rx="46" ry="7" fill="#22C55E" opacity="0.18" />

      {/* Outer body */}
      <path
        d="M 80 8
           C 100 8 122 26 130 56
           C 138 86 134 130 120 152
           C 111 165 49 165 40 152
           C 26 130 22 86 30 56
           C 38 26 60 8 80 8 Z"
        fill={`url(#dg-${size})`}
      />

      {/* Inner flesh */}
      <path
        d="M 80 18
           C 97 18 115 34 122 60
           C 129 86 126 125 113 145
           C 105 156 55 156 47 145
           C 34 125 31 86 38 60
           C 45 34 63 18 80 18 Z"
        fill="#F0FFF4"
        opacity="0.92"
      />

      {/* Screen */}
      <rect x="52" y="36" width="56" height="40" rx="7" fill="#1F2937" />

      {/* Waveform on screen */}
      <path
        d="M 58 56 L 64 56 L 67 47 L 71 64 L 74 52 L 77 59 L 80 50 L 83 58 L 87 48 L 90 60 L 93 56 L 100 56"
        stroke="#39D353"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Screen status dot */}
      <circle cx="97" cy="42" r="2.5" fill="#39D353" opacity="0.8" />

      {/* LED row */}
      <circle cx="62" cy="90" r="5" fill="#39D353" />
      <circle cx="80" cy="90" r="5" fill="#FACC15" />
      <circle cx="98" cy="90" r="5" fill="#EF4444" />
      {/* LED glow */}
      <circle cx="80" cy="90" r="9" fill="#FACC15" opacity="0.2" />
      <circle cx="98" cy="90" r="9" fill="#EF4444" opacity="0.2" />

      {/* Pit / power button */}
      <ellipse cx="80" cy="132" rx="22" ry="14" fill="#166534" opacity="0.85" />
      <ellipse cx="80" cy="132" rx="13" ry="8" fill="#15803D" opacity="0.6" />
      <circle cx="80" cy="132" r="4" fill="#39D353" opacity="0.5" />

      {/* Stem nub */}
      <rect x="74" y="2" width="12" height="8" rx="3" fill="#15803D" opacity="0.6" />
    </svg>
  );
}
