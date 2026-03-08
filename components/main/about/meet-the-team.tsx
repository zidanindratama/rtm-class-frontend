"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

const team = [
  {
    name: "Muhamad Zidan Indratama",
    role: "Full-Stack Developer",
    desc: "Architect behind RTM Class AI integration and asynchronous infrastructure.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Team Member 2",
    role: "AI Engineer",
    desc: "Focused on prompt engineering and Groq model optimization.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Team Member 2",
    role: "AI Engineer",
    desc: "Focused on prompt engineering and Groq model optimization.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    github: "#",
    linkedin: "#",
  },
];

export function MeetTheTeam() {
  return (
    <section className="py-32 px-4 md:px-8 bg-muted/5 border-b border-border/20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">
            laponGacor.ts
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
            Meet The Brains.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="group relative rounded-[2rem] overflow-hidden bg-card border border-border/50"
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>

              <div className="p-8 relative z-20 bg-card">
                <h3 className="text-2xl font-bold tracking-tight mb-1">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                <p className="text-muted-foreground font-light leading-relaxed mb-6">
                  {member.desc}
                </p>

                <div className="flex gap-4">
                  <Link
                    href={member.github}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </Link>
                  <Link
                    href={member.linkedin}
                    className="text-muted-foreground hover:text-[#0A66C2] transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
