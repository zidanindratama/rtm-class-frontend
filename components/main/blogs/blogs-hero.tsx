"use client";

import { motion } from "framer-motion";

export function BlogsHero() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative overflow-hidden border-b border-border/40 px-4 pb-18 pt-28 md:px-8 md:pb-24 md:pt-34">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_20%,hsl(var(--primary)/0.16),transparent_42%),radial-gradient(circle_at_78%_75%,hsl(var(--primary)/0.09),transparent_38%)]" />

      <div className="mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary"
        >
          RTM Journal
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.05, ease: smoothEase }}
          className="max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-6xl"
        >
          Notes on building AI-native education products.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.12, ease: smoothEase }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          A minimalist collection of ideas, experiments, and practical
          implementation stories from the RTM Class team.
        </motion.p>
      </div>
    </section>
  );
}
