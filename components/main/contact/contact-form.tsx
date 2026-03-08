"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="py-24 px-4 md:px-8 bg-muted/15 border-y border-border/30">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="lg:col-span-2"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
            Start a Conversation
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Share your goals, current stack, and timeline. We will route your
            request to the right specialist and follow up with practical next
            steps.
          </p>
          <div className="mt-8 p-6 rounded-2xl border border-border/50 bg-card">
            <p className="text-xs uppercase tracking-[0.18em] text-primary mb-2">
              Typical Requests
            </p>
            <p className="text-muted-foreground">
              API onboarding, enterprise adoption, webhook architecture, and
              model output quality optimization.
            </p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.75, ease: smoothEase }}
          className="lg:col-span-3 space-y-6 bg-card p-8 md:p-10 rounded-[2rem] border border-border/50 shadow-lg shadow-black/5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Name
              </label>
              <input
                type="text"
                className="w-full px-5 py-4 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Alex Johnson"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Email
              </label>
              <input
                type="email"
                className="w-full px-5 py-4 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="alex@company.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Organization
              </label>
              <input
                type="text"
                className="w-full px-5 py-4 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                placeholder="Northfield Academy"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Team Size
              </label>
              <select className="w-full px-5 py-4 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                <option>1-10 users</option>
                <option>11-50 users</option>
                <option>51-200 users</option>
                <option>200+ users</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Subject
            </label>
            <input
              type="text"
              className="w-full px-5 py-4 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Enterprise API Integration"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Message
            </label>
            <textarea
              rows={5}
              className="w-full px-5 py-4 rounded-xl bg-background border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
              placeholder="Tell us about your current workflow and what you want to improve."
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto rounded-xl h-14 px-8 text-base font-semibold shadow-lg shadow-primary/20"
            >
              Send Message
            </Button>
            <p className="text-sm text-muted-foreground">
              We typically reply within one business day.
            </p>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
