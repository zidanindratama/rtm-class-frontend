"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Mail, MapPin } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "EMAIL",
    value: "hello@rtmclass.ai",
    link: "mailto:hello@rtmclass.ai",
  },
  {
    icon: Github,
    label: "GITHUB",
    value: "github.com/laponGacor",
    link: "https://github.com",
  },
  { icon: MapPin, label: "HQ", value: "Depok, Indonesia", link: "#" },
];

export function DirectConnect() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="py-20 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Direct Connect
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Reach us through the channel that fits your process. We keep
            communication clear, responsive, and solution-oriented.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contacts.map((item, i) => (
          <motion.a
            href={item.link}
            key={item.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: smoothEase }}
            className="group block p-8 md:p-10 bg-card border border-border/50 rounded-3xl hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-10">
              <item.icon className="w-6 h-6" />
            </div>
            <p className="font-mono text-xs tracking-widest text-muted-foreground mb-3">
              {item.label}
            </p>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl md:text-2xl font-bold text-foreground break-words">
                {item.value}
              </h3>
              <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </div>
          </motion.a>
        ))}
        </div>
      </div>
    </section>
  );
}
