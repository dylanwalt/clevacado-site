"use client";

import { motion } from "framer-motion";
import { Activity, MapPin, Package } from "lucide-react";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import SectionLabel from "./SectionLabel";

const STEP_ICONS = [Package, Activity, MapPin];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="px-6 py-24 sm:py-28"
      style={{ background: "#FFFFFF" }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <SectionLabel className="justify-center">How ClevaCado works</SectionLabel>
          <h2
            data-display="true"
            className="text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            From movement data to decisions farmers can act on.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            ClevaCado is a post-harvest diagnostics tool for avocado supply
            chains. It follows the fruit, captures hidden handling stress, and
            shows producers where bruising begins.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="relative rounded-[28px] border p-7"
                style={{
                  background: "#FFFFFF",
                  borderColor: "rgba(34,197,94,0.15)",
                  boxShadow: "0 20px 60px rgba(22,101,52,0.08)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ background: "#DCFCE7", color: "#166534" }}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-semibold tracking-[0.22em] text-emerald-600">
                    {step.number}
                  </span>
                </div>
                <h3
                  data-display="true"
                  className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                >
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
