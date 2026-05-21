import { HTMLAttributes, PropsWithChildren } from "react";

type ParallaxLayerProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    speed?: "slow" | "medium" | "fast";
  }
>;

const SPEED_CLASS = {
  slow: "hero-layer-slow",
  medium: "hero-layer-medium",
  fast: "hero-layer-fast",
} as const;

export default function ParallaxLayer({
  children,
  className = "",
  speed = "medium",
  ...props
}: ParallaxLayerProps) {
  return (
    <div
      className={`${SPEED_CLASS[speed]} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
