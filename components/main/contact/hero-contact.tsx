"use client";

import { motion } from "framer-motion";
import { MessagesSquare, Clock3, LifeBuoy } from "lucide-react";

export function HeroContact() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 flex items-center justify-center overflow-hidden px-4 border-b border-border/20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[100px] mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.4, 0.25],
            x: [0, -40, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-[10%] right-[10%] w-[36vw] h-[36vw] rounded-full bg-blue-500/10 blur-[110px]"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: smoothEase }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6"
        >
          Let&apos;s Build Better{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            Learning Systems.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: smoothEase }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl font-light leading-relaxed"
        >
          Need integration support, enterprise onboarding, or technical guidance
          for your API workflow? Our team is ready to help.
        </motion.p>
      </div>
    </section>
  );
}
