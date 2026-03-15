"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "3", label: "User Roles Supported" },
  { value: "8+", label: "Core Learning Modules" },
  { value: "1", label: "Unified Dashboard" },
  { value: "24/7", label: "Platform Access" },
];

export function ImpactStats() {
  return (
    <section className="py-32 px-4 md:px-8 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-foreground">
            The Numbers.
          </h2>
          <p className="text-xl text-muted-foreground font-light">
            Product capabilities built to support real teaching workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center group"
            >
              <div className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/20 mb-4 group-hover:scale-105 transition-transform duration-500">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-medium tracking-widest uppercase text-primary">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
