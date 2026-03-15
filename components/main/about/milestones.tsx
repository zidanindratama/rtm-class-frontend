"use client";

import { motion } from "framer-motion";

const milestones = [
  {
    year: "Q1 2025",
    title: "Initial Product Concept",
    desc: "The first idea focused on simplifying class administration and reducing manual teaching overhead.",
  },
  {
    year: "Q3 2025",
    title: "Platform Foundation",
    desc: "Core backend modules for authentication, class management, and user roles were built and stabilized.",
  },
  {
    year: "Q1 2026",
    title: "Learning Workflow Expansion",
    desc: "Assignments, forums, blog CMS, and material workflows were integrated into a unified dashboard experience.",
  },
  {
    year: "Now",
    title: "Production Rollout",
    desc: "RTM Class is now positioned as a complete platform for daily education operations and collaboration.",
  },
];

export function Milestones() {
  return (
    <section className="py-32 px-4 md:px-8 bg-background relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-20 text-center"
        >
          Our Journey.
        </motion.h2>

        <div className="relative border-l-2 border-primary/20 ml-4 md:ml-1/2">
          {milestones.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="mb-16 ml-10 relative"
            >
              <div className="absolute -left-[49px] top-1 w-5 h-5 rounded-full bg-background border-4 border-primary shadow-[0_0_15px_rgba(var(--primary),0.6)]" />

              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-3 tracking-widest">
                {item.year}
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-lg">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
