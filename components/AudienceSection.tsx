"use client";

import { motion } from "framer-motion";
import { Factory, Leaf, Package, Truck } from "lucide-react";
import { AUDIENCE_CARDS } from "@/lib/constants";
import SectionLabel from "./SectionLabel";

const ICONS = [Leaf, Factory, Package, Truck];

export default function AudienceSection() {
  return (
    <section
      id="audience"
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
          <SectionLabel className="justify-center">Who it is for</SectionLabel>
          <h2
            data-display="true"
            className="text-balance text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Built for every team protecting avocado quality.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            ClevaCado is designed to support the people making post-harvest
            handling decisions across the full avocado journey.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {AUDIENCE_CARDS.map((card, index) => {
            const Icon = ICONS[index];
            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="rounded-[28px] border p-7"
                style={{
                  background: "#F7FFF8",
                  borderColor: "rgba(34,197,94,0.15)",
                  boxShadow: "0 20px 60px rgba(22,101,52,0.08)",
                }}
              >
                <span
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ background: "#DCFCE7", color: "#166534" }}
                >
                  <Icon size={22} />
                </span>
                <h3
                  data-display="true"
                  className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                >
                  {card.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {card.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
