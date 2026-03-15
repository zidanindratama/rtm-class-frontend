"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  const revealVariants = {
    hidden: { y: "150%" },
    show: {
      y: 0,
      transition: { duration: 0.8, ease: smoothEase },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 w-full h-full -z-10 bg-background">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(var(--primary),0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      </div>

      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[15%] w-72 h-72 bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0], scale: [1, 1.1, 1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-5xl mx-auto text-center z-10 flex flex-col items-center"
      >
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-foreground mb-8 leading-[1.05] flex flex-col items-center">
          <span className="overflow-hidden block pb-2">
            <motion.span variants={revealVariants} className="block">
              Manage Modern
            </motion.span>
          </span>
          <span className="overflow-hidden block pb-2">
            <motion.span variants={revealVariants} className="block">
              Classroom Workflows{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_auto] animate-gradient">
                End-to-End.
              </span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-lg md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light tracking-wide leading-relaxed"
        >
          RTM Class unifies class management, assignments, forums, materials,
          blogs, and AI-assisted content generation in one streamlined platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-500"></div>
            <Button
              asChild
              size="lg"
              className="relative h-16 px-10 rounded-full text-lg font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
            >
              <Link href="/auth/sign-up">
                Start Using RTM Class
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-16 px-10 rounded-full text-lg font-medium hover:bg-muted/50 backdrop-blur-sm transition-all duration-300"
          >
            <Link href="/about">About</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
