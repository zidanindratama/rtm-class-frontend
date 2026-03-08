"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { mainRoutes } from "@/routes/main-routes";

export function Navbar() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: smoothEase }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-20 px-4 md:px-8 backdrop-blur-xl bg-background/70 border-b border-border/40"
    >
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 group-hover:shadow-primary/40 transition-all duration-300">
            R
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            RTM Class<span className="text-primary">.ai</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {mainRoutes.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] rounded-full bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button
            asChild
            className="hidden md:inline-flex rounded-full px-6 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
