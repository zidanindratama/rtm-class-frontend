"use client";

import { motion } from "framer-motion";

const clients = [
  "Universitas Gunadarma",
  "Teknodigital Indonesia",
  "DOT Indonesia",
  "Candidate College",
  "Moonlay Technologies",
  "Universitas Gunadarma",
  "Teknodigital Indonesia",
  "DOT Indonesia",
  "Candidate College",
  "Moonlay Technologies",
];

export function ClientLogos() {
  return (
    <section className="py-16 overflow-hidden bg-background relative border-y border-border/20">
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10" />

      <p className="text-center text-xs tracking-[0.2em] font-semibold text-muted-foreground uppercase mb-10">
        Used Across Schools, Teams, and Learning Communities
      </p>

      <div className="relative flex overflow-x-hidden group">
        <motion.div
          className="flex items-center gap-16 md:gap-24 whitespace-nowrap px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          {clients.map((client, index) => (
            <span
              key={index}
              className="text-xl md:text-3xl font-extrabold tracking-tighter text-foreground/20 hover:text-primary transition-colors duration-300 cursor-default"
            >
              {client}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
