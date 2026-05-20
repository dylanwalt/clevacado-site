interface ClevaCadoLogoProps {
  size?: number;
  className?: string;
  color?: string;
  faceColor?: string;
}

export default function ClevaCadoLogo({
  size = 40,
  className = "",
  color = "#39D353",
  faceColor = "white",
}: ClevaCadoLogoProps) {
  const h = Math.round(size * 1.3);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ClevaCado logo"
      role="img"
    >
      {/* Avocado body — single solid shape */}
      <path
        d="M 50 6
           C 66 6 84 23 90 48
           C 96 73 92 103 76 118
           C 67 126 33 126 24 118
           C 8 103 4 73 10 48
           C 16 23 34 6 50 6 Z"
        fill={color}
      />

      {/* Eyes */}
      <circle cx="37" cy="56" r="5" fill={faceColor} />
      <circle cx="63" cy="56" r="5" fill={faceColor} />

      {/* Smile */}
      <path
        d="M 35 72 Q 50 86 65 72"
        stroke={faceColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
