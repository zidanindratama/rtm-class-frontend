"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function OriginStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <section
      ref={containerRef}
      className="py-40 px-4 md:px-8 bg-background relative z-10"
    >
      <div className="max-w-4xl mx-auto">
        <p className="text-primary font-mono text-sm tracking-widest uppercase mb-12 border-l-2 border-primary pl-4">
          The Origin Story
        </p>

        <motion.p
          style={{ opacity, y }}
          className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground"
        >
          It started with one clear challenge:{" "}
          <span className="text-muted-foreground">
            educators were spending up to 80% of their time on administrative
            tasks instead of teaching.
          </span>{" "}
          We built RTM Class AI to reverse that equation and give valuable time
          back to the people shaping the future of learning.
        </motion.p>
      </div>
    </section>
  );
}
