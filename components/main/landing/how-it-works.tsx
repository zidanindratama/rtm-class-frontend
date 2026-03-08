"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Upload Material",
    desc: "Send your files (PDF, PPTX, TXT) via multipart form-data.",
  },
  {
    step: "02",
    title: "Async AI Processing",
    desc: "Receive a fast 202 Accepted response while RAG workers process in the background.",
  },
  {
    step: "03",
    title: "Webhook Delivery",
    desc: "Generated questions and summaries are delivered directly to your callback URL.",
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
      className="overflow-x-clip py-32 px-4 md:px-8 bg-muted/20 border-y border-border/20"
    >
      <div className="max-w-4xl mx-auto" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
            Seamless Workflow.
          </h2>
          <p className="text-xl text-muted-foreground font-light">
            Our asynchronous architecture keeps your UI responsive at every step.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-border -translate-x-1/2" />
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-[2px] bg-primary -translate-x-1/2 origin-top"
          />

          <div className="space-y-24 overflow-x-clip">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex-1 w-full ${i % 2 !== 0 ? "md:text-left" : "md:text-right"} pl-24 md:pl-0`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <span className="text-6xl md:text-8xl font-black text-foreground/5 tracking-tighter block mb-2">
                      {item.step}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-lg font-light leading-relaxed">
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
