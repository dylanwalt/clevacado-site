"use client";

import { motion } from "framer-motion";
import { SENSOR_FEATURES } from "@/lib/constants";
import SectionLabel from "./SectionLabel";
import AvoDevice from "./AvoDevice";

function SensorDiagram() {
  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      style={{ width: 360, height: 420 }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 48%, rgba(57,211,83,0.14) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />

      {/* Measurement rings + 3-axis lines */}
      <svg
        className="absolute inset-0"
        width="360"
        height="420"
        viewBox="0 0 360 420"
        fill="none"
        aria-hidden="true"
      >
        {/* Outer ring */}
        <circle cx="180" cy="210" r="158" stroke="#DCFCE7" strokeWidth="1.5" strokeDasharray="7 5" />
        {/* Inner ring */}
        <circle cx="180" cy="210" r="108" stroke="#DCFCE7" strokeWidth="1" strokeDasharray="3 5" opacity="0.4" />

        {/* X axis */}
        <line x1="20" y1="210" x2="340" y2="210" stroke="#39D353" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.32" />
        {/* Y axis */}
        <line x1="180" y1="20" x2="180" y2="400" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.32" />
        {/* Z diagonal */}
        <line x1="96" y1="118" x2="264" y2="302" stroke="#FACC15" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.2" />

        {/* Arrowheads */}
        <polygon points="334,205 344,210 334,215" fill="#39D353" opacity="0.42" />
        <polygon points="175,24 180,14 185,24" fill="#22C55E" opacity="0.42" />
        <polygon points="259,297 268,306 257,305" fill="#FACC15" opacity="0.32" />

        {/* Axis labels */}
        <text x="323" y="204" fontSize="15" fontWeight="700" fill="#39D353" opacity="0.6">X</text>
        <text x="172" y="12" fontSize="15" fontWeight="700" fill="#22C55E" opacity="0.6">Y</text>
        <text x="270" y="308" fontSize="15" fontWeight="700" fill="#FACC15" opacity="0.6">Z</text>
      </svg>

      {/* Device */}
      <div className="relative z-10">
        <AvoDevice size={200} />
      </div>

      {/* Metric chips — one at each compass point */}
      {/* Top */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap z-20"
        style={{ top: 8, background: "#FEE2E2", color: "#9A3412", border: "1px solid #FECACA" }}
      >
        ⚡ Up to 16 g impact
      </div>
      {/* Right */}
      <div
        className="absolute flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap z-20"
        style={{
          top: "42%",
          right: 4,
          transform: "translateY(-50%)",
          background: "#DCFCE7",
          color: "#166534",
          border: "1px solid #A7F3D0",
        }}
      >
        〰️ 3-axis
      </div>
      {/* Bottom */}
      <div
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap z-20"
        style={{ bottom: 8, background: "#FEF9C3", color: "#854D0E", border: "1px solid #FDE68A" }}
      >
        🔄 360° rotation
      </div>
      {/* Left */}
      <div
        className="absolute flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap z-20"
        style={{
          top: "42%",
          left: 4,
          transform: "translateY(-50%)",
          background: "#E0F2FE",
          color: "#075985",
          border: "1px solid #BAE6FD",
        }}
      >
        📊 Per-stage data
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function SensorSection() {
  return (
    <section
      id="technology"
      className="py-32 px-6"
      style={{ background: "white" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <SectionLabel className="justify-center">THE TECHNOLOGY</SectionLabel>
          <h2
            className="text-3xl md:text-4xl font-extrabold max-w-2xl mx-auto leading-tight mb-5"
            style={{ color: "#1F2937" }}
          >
            Inside ClevaCado is a compact{" "}
            <span style={{ color: "#39D353" }}>inertial measurement system.</span>
          </h2>
          <p className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
            Embedded accelerometers and gyroscopes capture impact, vibration,
            rotation, and handling stress as the device moves through real
            avocado handling environments.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Sensor diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <SensorDiagram />
          </motion.div>

          {/* Feature cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col gap-5"
          >
            {SENSOR_FEATURES.map((feature) => (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                className="flex items-start gap-5 p-6 rounded-2xl group transition-all"
                style={{
                  background: "white",
                  border: "1px solid #DCFCE7",
                  boxShadow: "0 1px 8px rgba(57,211,83,0.05)",
                }}
                whileHover={{
                  boxShadow: "0 4px 20px rgba(57,211,83,0.12)",
                  borderColor: "#A7F3D0",
                  y: -2,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "#DCFCE7" }}
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-bold text-base" style={{ color: "#1F2937" }}>
                      {feature.title}
                    </h3>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "#DCFCE7", color: "#166534" }}
                    >
                      {feature.metric}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.p
              variants={itemVariants}
              className="text-sm font-semibold text-center pt-2"
              style={{ color: "#39D353" }}
            >
              From inertial motion data to actionable post-harvest intelligence.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
