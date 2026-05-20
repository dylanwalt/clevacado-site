"use client";

import { motion } from "framer-motion";
import { IMPACT_CARDS } from "@/lib/constants";
import SectionLabel from "./SectionLabel";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function ImpactSection() {
  return (
    <section id="impact" className="py-32 px-6" style={{ background: "white" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionLabel className="justify-center">THE IMPACT</SectionLabel>
          <h2
            className="text-3xl md:text-4xl font-extrabold max-w-2xl mx-auto leading-tight mb-4"
            style={{ color: "#1F2937" }}
          >
            Less damage.{" "}
            <span style={{ color: "#39D353" }}>Better quality.</span>{" "}
            More value from every harvest.
          </h2>
          <p className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
            ClevaCado helps producers identify where quality is lost, so they
            can improve handling processes, reduce waste, and protect more fruit
            on its journey to market.
          </p>
        </motion.div>

        {/* Impact cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {IMPACT_CARDS.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              className="p-6 rounded-2xl group transition-all cursor-default"
              style={{
                background: "white",
                border: "1px solid #DCFCE7",
                boxShadow: "0 1px 8px rgba(57,211,83,0.05)",
              }}
              whileHover={{
                boxShadow: "0 8px 28px rgba(57,211,83,0.14)",
                borderColor: "#86EFAC",
                y: -4,
                transition: { duration: 0.25 },
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: "#DCFCE7" }}
                aria-hidden="true"
              >
                {card.icon}
              </div>
              <h3
                className="font-bold text-base mb-2"
                style={{ color: "#1F2937" }}
              >
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            {
              stat: "20–40%",
              label: "of post-harvest losses",
              sub: "linked to physical supply-chain damage",
            },
            {
              stat: "7 stages",
              label: "tracked end-to-end",
              sub: "from harvesting to market arrival",
            },
            {
              stat: "3-axis",
              label: "inertial measurement",
              sub: "impact, vibration, and rotation sensing",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl"
              style={{
                background: "#F7FFF8",
                border: "1px solid #DCFCE7",
              }}
            >
              <p
                className="text-4xl font-extrabold mb-1"
                style={{ color: "#39D353" }}
              >
                {item.stat}
              </p>
              <p className="font-semibold text-base" style={{ color: "#1F2937" }}>
                {item.label}
              </p>
              <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
                {item.sub}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
