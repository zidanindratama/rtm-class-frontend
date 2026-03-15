"use client";

import { motion } from "framer-motion";

const benefits = [
  {
    id: "01",
    title: "Operational Clarity",
    desc: "Bring classes, assignments, forums, materials, and blogs into one coordinated teaching platform.",
  },
  {
    id: "02",
    title: "Role-Based Collaboration",
    desc: "Admins, teachers, and students get focused experiences with permissions that match their responsibilities.",
  },
  {
    id: "03",
    title: "Faster Content Throughput",
    desc: "Reduce repetitive prep work with reusable workflows and AI-assisted generation for assessment and summary tasks.",
  },
];

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="py-32 px-4 md:px-8 bg-background relative overflow-hidden border-y border-border/40"
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 relative z-10">
        <div className="md:w-1/2">
          <div className="sticky top-32">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-foreground"
            >
              Designed for <br /> High Throughput.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground font-light leading-relaxed max-w-md"
          >
              RTM Class is designed as a complete learning operations platform
              that helps teams move quickly while keeping quality consistent.
            </motion.p>
          </div>
        </div>

        <div className="md:w-1/2 space-y-12">
          {benefits.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="border-b border-border/50 pb-12 group hover:border-primary/30 transition-colors duration-500"
            >
              <div className="text-primary font-mono text-sm mb-4 tracking-widest flex items-center gap-2">
                <span className="w-8 h-[1px] bg-primary/50 group-hover:w-12 transition-all duration-300" />
                {item.id}
              </div>
              <h3 className="text-3xl font-bold mb-4 tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
