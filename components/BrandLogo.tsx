"use client";

import Image from "next/image";
import markImage from "@/public/branding/clevacado-mark.png";
import stackedImage from "@/public/branding/clevacado-stacked-logo.png";

type BrandLogoProps = {
  variant?: "mark" | "lockup" | "stacked";
  markSize?: number;
  stackedWidth?: number;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  subtitle?: string;
  priority?: boolean;
};

export default function BrandLogo({
  variant = "lockup",
  markSize = 44,
  stackedWidth = 200,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  subtitle = "Post-harvest diagnostics",
  priority = false,
}: BrandLogoProps) {
  if (variant === "mark") {
    return (
      <Image
        src={markImage}
        alt="ClevaCado logo mark"
        priority={priority}
        className={className}
        style={{
          width: markSize,
          height: "auto",
        }}
      />
    );
  }

  if (variant === "stacked") {
    return (
      <Image
        src={stackedImage}
        alt="ClevaCado logo"
        priority={priority}
        className={className}
        style={{
          width: stackedWidth,
          height: "auto",
        }}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <Image
        src={markImage}
        alt="ClevaCado logo mark"
        priority={priority}
        style={{
          width: markSize,
          height: "auto",
        }}
      />
      <div className="min-w-0">
        <p
          className={`text-base font-semibold tracking-[-0.03em] text-slate-950 ${titleClassName}`.trim()}
          style={{ color: "#174D2A" }}
        >
          ClevaCado
        </p>
        <p
          className={`text-xs font-medium text-slate-500 ${subtitleClassName}`.trim()}
          style={{ color: "#66796B" }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}
