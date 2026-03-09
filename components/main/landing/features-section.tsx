"use client";

import { motion } from "framer-motion";
import { CheckSquare, AlignLeft, FileText } from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-32 px-4 md:px-8 relative z-10 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 mb-20 items-end">
          <div className="flex-1">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-primary font-semibold tracking-wider uppercase text-sm mb-4"
            >
              Core Capabilities
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold tracking-tighter"
            >
              Powerful Learning <br className="hidden md:block" /> Generators.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-1 text-lg text-muted-foreground leading-relaxed font-light"
          >
            Three core capabilities help your team produce learning content
            faster with reliable AI outputs, so educators can focus on
            instruction instead of repetitive prep work.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[320px]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="md:col-span-2 relative group rounded-[2rem] bg-card border border-border/50 hover:border-primary/50 overflow-hidden transition-colors duration-500 min-h-[320px] md:min-h-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="p-6 md:p-10 h-full flex flex-col justify-between relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                <CheckSquare className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">
                  Generate MCQ
                </h3>
                <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-lg">
                  Create complete multiple-choice sets with answer keys. Control
                  question count and difficulty level dynamically through the
                  API.
                </p>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 border-[40px] border-primary/5 rounded-full group-hover:scale-110 transition-transform duration-700 ease-out" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative group rounded-[2rem] bg-card border border-border/50 hover:border-primary/50 overflow-hidden transition-colors duration-500 min-h-[320px] md:min-h-0"
          >
            <div className="p-6 md:p-10 h-full flex flex-col justify-between relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-all duration-500">
                <AlignLeft className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3 tracking-tight">
                  Generate Essay
                </h3>
                <p className="text-muted-foreground font-light">
                  Build open-ended prompts designed to spark critical thinking
                  from the uploaded context.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="md:col-span-3 relative group rounded-[2rem] bg-card border border-border/50 hover:border-primary/50 overflow-hidden transition-colors duration-500 min-h-[320px] md:h-[320px]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] group-hover:opacity-50 transition-opacity duration-500" />
            <div className="p-6 md:p-10 h-full flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 relative z-10">
              <div className="w-20 h-20 shrink-0 rounded-3xl bg-foreground text-background flex items-center justify-center group-hover:rotate-12 transition-all duration-500">
                <FileText className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                  Smart Contextual Summary
                </h3>
                <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-3xl">
                  Turn long PDFs or slide decks into clear, compact summaries.
                  Perfect for review packs, lesson recaps, and rapid study
                  notes.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}