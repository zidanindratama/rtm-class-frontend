"use client";

import { motion } from "framer-motion";

const techStack = [
  {
    name: "FastAPI",
    role: "Core Microservice",
    color: "text-[#009688]",
    bg: "bg-[#009688]/10",
  },
  {
    name: "Redis",
    role: "Async Queue Worker",
    color: "text-[#DC382D]",
    bg: "bg-[#DC382D]/10",
  },
  {
    name: "LangChain",
    role: "RAG & AI Orchestration",
    color: "text-[#1C3C3C]",
    bg: "bg-[#1C3C3C]/10 dark:bg-white/10 dark:text-white",
  },
  {
    name: "Groq",
    role: "LLM Inference Engine",
    color: "text-[#F55036]",
    bg: "bg-[#F55036]/10",
  },
];

export function Architecture() {
  return (
    <section className="py-32 px-4 md:px-8 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-primary font-mono text-sm tracking-widest uppercase mb-4"
          >
            Under The Hood
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6"
          >
            Engineered for <br /> Performance.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground font-light leading-relaxed mb-8"
          >
            We combine asynchronous processing with high-speed language models
            to deliver reliable execution without blocking user-facing
            applications.
          </motion.p>
        </div>

        <div className="lg:w-1/2 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className={`p-6 rounded-3xl border border-border/50 ${tech.bg} flex flex-col justify-center h-40 backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
            >
              <h4 className={`text-2xl font-black mb-1 ${tech.color}`}>
                {tech.name}
              </h4>
              <p className="text-sm font-medium opacity-70 text-foreground">
                {tech.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
