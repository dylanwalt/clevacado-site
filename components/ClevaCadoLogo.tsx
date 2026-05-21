interface ClevaCadoLogoProps {
  size?: number;
  className?: string;
}

export default function ClevaCadoLogo({
  size = 40,
  className = "",
}: ClevaCadoLogoProps) {
  const height = Math.round(size * 1.28);
  const strokeWidth = size > 140 ? 6 : 5;

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 160 205"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ClevaCado logo"
      role="img"
    >
      <defs>
        <linearGradient id={`clevacado-shell-${size}`} x1="28" y1="16" x2="132" y2="188">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
        <filter id={`clevacado-shadow-${size}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="16" floodColor="#15803D" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter={`url(#clevacado-shadow-${size})`}>
        <path
          d="M80 10C101 10 123 25 133 54C145 88 140 145 116 173C106 186 54 186 44 173C20 145 15 88 27 54C37 25 59 10 80 10Z"
          fill={`url(#clevacado-shell-${size})`}
        />
        <path
          d="M80 28C95 28 111 40 118 63C126 88 123 133 106 154C99 163 61 163 54 154C37 133 34 88 42 63C49 40 65 28 80 28Z"
          fill="#FFFFFF"
          stroke="#D1FAE5"
          strokeWidth={strokeWidth * 0.55}
        />
      </g>

      <ellipse cx="80" cy="114" rx="24" ry="27" fill="#DCFCE7" />
      <ellipse cx="80" cy="114" rx="15" ry="17" fill="#86EFAC" opacity="0.8" />

      <circle cx="66" cy="92" r="4.6" fill="#166534" />
      <circle cx="94" cy="92" r="4.6" fill="#166534" />
      <path
        d="M66 124C72 132 88 132 94 124"
        stroke="#166534"
        strokeWidth={strokeWidth * 0.7}
        strokeLinecap="round"
      />

      <path
        d="M74 8C76 2 83 1 87 6"
        stroke="#166534"
        strokeWidth={strokeWidth * 0.45}
        strokeLinecap="round"
      />
    </svg>
  );
}
