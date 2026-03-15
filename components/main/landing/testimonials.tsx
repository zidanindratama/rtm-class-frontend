"use client";

import { motion } from "framer-motion";

const reviews = [
  {
    name: "Nadia Pratama",
    role: "Curriculum Lead",
    content:
      "Our teaching team now manages classes, assignments, and discussions in one place. Coordination is much faster.",
  },
  {
    name: "Arif Rahman",
    role: "Senior Teacher",
    content:
      "The assignment and grading flow is clear for both teachers and students. It reduced manual follow-up significantly.",
  },
  {
    name: "Dewi Lestari",
    role: "School Operations Manager",
    content:
      "Role-based access and centralized workflows helped us standardize operations across multiple classes.",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-32 px-4 md:px-8 bg-background relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
            Trusted by Education Teams.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6, ease: "easeOut" }}
              className="p-10 rounded-[2rem] bg-card border border-border/50 shadow-xl shadow-black/5 hover:-translate-y-2 transition-transform duration-500"
            >
              <p className="text-foreground text-lg leading-relaxed font-light mb-8">
                "{review.content}"
              </p>
              <div className="pt-8 border-t border-border/50">
                <h4 className="font-bold text-lg">{review.name}</h4>
                <p className="text-sm text-primary mt-1">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
