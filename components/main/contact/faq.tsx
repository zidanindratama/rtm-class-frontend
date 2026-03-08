"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What does the webhook payload look like?",
    answer:
      "When a job completes, your callback endpoint receives an HTTP POST with a JSON body containing success, data, and the original job_id.",
  },
  {
    question: "Which document formats are supported?",
    answer:
      "Our ingestion pipeline currently supports .pdf, .pptx, and .txt files uploaded through multipart form-data.",
  },
  {
    question: "How long does asynchronous processing usually take?",
    answer:
      "Processing time depends on file size. For documents under 20 pages, extraction and RAG inference are often completed in around 5-15 seconds.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="py-24 px-4 md:px-8 bg-muted/10 border-y border-border/40">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Technical answers to common questions about integration and API behavior.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: smoothEase }}
                className="rounded-2xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <span className="font-semibold text-lg text-foreground pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-6 h-6 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="p-6 md:p-8 pt-0 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
