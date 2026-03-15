"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const statuses = [
  { name: "Frontend Experience", status: "Operational", uptime: "99.9%" },
  { name: "Core API Service", status: "Operational", uptime: "99.9%" },
  { name: "Database and Queue", status: "Operational", uptime: "99.8%" },
  { name: "Auth and Access Layer", status: "Operational", uptime: "99.9%" },
];

export function SystemStatus() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="py-24 px-4 md:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: smoothEase }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              System Status
            </h2>
            <p className="text-muted-foreground">
              Operational overview of RTM Class platform services.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 border border-green-500/20 text-sm font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            All Systems Operational
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statuses.map((sys, i) => (
            <motion.div
              key={sys.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: smoothEase }}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/25 transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-foreground text-lg">
                    {sys.name}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                  {sys.status}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
                  style={{ width: sys.uptime }}
                />
              </div>
              <p className="text-sm text-muted-foreground">Uptime {sys.uptime}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
