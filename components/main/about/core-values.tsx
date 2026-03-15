"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Maximize } from "lucide-react";

const values = [
  {
    icon: Zap,
    title: "Speed",
    desc: "Design workflow yang ringkas membantu tim bergerak cepat dari perencanaan kelas sampai evaluasi hasil belajar.",
  },
  {
    icon: ShieldCheck,
    title: "Reliability",
    desc: "Platform dirancang stabil untuk kebutuhan operasional harian sekolah, guru, dan siswa.",
  },
  {
    icon: Maximize,
    title: "Scalability",
    desc: "Arsitektur modular memudahkan ekspansi dari satu kelas ke banyak kelas tanpa mengubah alur utama.",
  },
];

export function CoreValues() {
  return (
    <section className="py-32 px-4 md:px-8 bg-muted/10 border-y border-border/20">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold tracking-tighter mb-20 text-center"
        >
          Core Values
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, i) => (
            <motion.div
              key={val.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="p-10 rounded-[2rem] bg-card border border-border/40 hover:border-primary/40 group transition-colors duration-500"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                <val.icon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{val.title}</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {val.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
