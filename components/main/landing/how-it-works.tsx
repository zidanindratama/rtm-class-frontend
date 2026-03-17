"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Set Up Class Structure",
    desc: "Create classes, manage members, and define your teaching context before publishing activities.",
  },
  {
    step: "02",
    title: "Publish Learning Activities",
    desc: "Add materials, create assignments, and open class forums so students can learn and collaborate.",
  },
  {
    step: "03",
    title: "Track, Review, and Improve",
    desc: "Monitor submissions, grade outcomes, and iterate content quality with AI-assisted workflows.",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="how-it-works"
      className="overflow-x-clip py-20 md:py-28 px-4 md:px-8 bg-muted/20 border-y border-border/20"
    >
      <div className="max-w-4xl mx-auto" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 md:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-5 md:mb-6">
            Seamless Workflow.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground font-light">
            A practical learning workflow from setup to delivery and feedback.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-border -translate-x-1/2" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-[2px] bg-primary -translate-x-1/2 origin-top"
          />

          <div className="space-y-16 md:space-y-24 overflow-x-clip">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex-1 w-full ${i % 2 !== 0 ? "md:text-left" : "md:text-right"} pl-16 sm:pl-20 md:pl-0`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <span className="text-5xl md:text-7xl font-black text-foreground/5 tracking-tighter block mb-2">
                      {item.step}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-base md:text-lg font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                </div>

                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border-4 border-primary z-10 shadow-[0_0_15px_rgba(var(--primary),0.5)]" />

                <div className="hidden md:block flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
