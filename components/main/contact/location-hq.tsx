"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export function LocationHq() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="py-32 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="relative rounded-[2.5rem] overflow-hidden bg-card border border-border/50 p-12 md:p-16 text-center flex flex-col items-center shadow-[0_20px_60px_rgba(0,0,0,0.06)]"
        >
          <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center text-primary mb-8 shadow-md">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Depok, Indonesia
          </h3>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Our headquarters coordinates product, infrastructure, and support
            operations for partners across regions.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border/60 bg-background text-sm font-medium text-foreground">
            <span className="w-2 h-2 rounded-full bg-primary" />
            UTC+7 | Mon-Fri, 9:00-18:00
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.08)_0%,transparent_60%)] pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
