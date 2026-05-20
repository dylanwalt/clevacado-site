import AvoDevice from "./AvoDevice";

type ProductRenderProps = {
  className?: string;
  tone?: "light" | "dark";
};

export default function ProductRender({
  className = "",
  tone = "light",
}: ProductRenderProps) {
  const isDark = tone === "dark";

  return (
    <div className={`relative w-fit ${className}`}>
      <div
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full blur-3xl"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.00) 70%)"
            : "radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.00) 70%)",
        }}
        aria-hidden="true"
      />

      <div
        className="relative rounded-[44px] border p-8 shadow-[0_30px_80px_-35px_rgba(2,6,23,0.45)]"
        style={{
          borderColor: isDark
            ? "rgba(255,255,255,0.12)"
            : "rgba(15,23,42,0.10)",
          background: isDark
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.75)",
          backdropFilter: "saturate(180%) blur(22px)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[44px]"
          style={{
            background: isDark
              ? "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative">
          <AvoDevice
            size={280}
            className="drop-shadow-[0_55px_55px_rgba(2,6,23,0.20)]"
          />
        </div>
      </div>
    </div>
  );
}

