"use client";

import { motion } from "framer-motion";
import { Github, ArrowRight } from "lucide-react";
import Link from "next/link";

export function OpenSource() {
  return (
    <section className="py-0 px-4 md:px-8 bg-[#050505] border-y border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row border-x border-white/10">
        {/* Left Side: Big Block */}
        <div className="md:w-1/2 bg-primary p-12 md:p-24 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
          <Github className="w-16 h-16 text-primary-foreground mb-16" />
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-primary-foreground mb-6">
              Build <br /> With Us.
            </h2>
            <p className="text-primary-foreground/80 font-mono text-sm md:text-base max-w-sm">
              RTM Class AI is built on the spirit of collaboration. Found a bug?
              Have an idea for a new prompt pipeline?
            </p>
          </div>
        </div>

        {/* Right Side: Action Link */}
        <div className="md:w-1/2 bg-[#0A0A0A] group relative overflow-hidden">
          <Link
            href="https://github.com"
            className="absolute inset-0 p-12 md:p-24 flex flex-col justify-between z-10"
          >
            <p className="font-mono tracking-widest text-white/40 uppercase text-sm">
              Repository
            </p>
            <div className="flex items-center justify-between">
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white group-hover:text-black transition-colors duration-300">
                View Source
              </h3>
              <ArrowRight className="w-10 h-10 text-white group-hover:text-black group-hover:translate-x-4 transition-all duration-300" />
            </div>
          </Link>
          {/* Hover Solid Background Reveal */}
          <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
        </div>
      </div>
    </section>
  );
}
