"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CtaSectionProps = {
  title: string;
  description: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText?: string;
  secondaryBtnHref?: string;
};

export function CtaSection({
  title,
  description,
  primaryBtnText,
  primaryBtnHref,
  secondaryBtnText,
  secondaryBtnHref,
}: CtaSectionProps) {
  return (
    <section className="py-20 md:py-28 px-4 md:px-8 relative overflow-hidden border-t border-border/20">
      <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 -z-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-[100%] blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mb-6 md:mb-8 text-foreground"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground font-light mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link href={primaryBtnHref} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full text-base sm:text-lg font-bold shadow-[0_0_40px_rgba(var(--primary),0.4)] hover:shadow-[0_0_60px_rgba(var(--primary),0.6)] hover:-translate-y-1 transition-all duration-300 group"
            >
              {primaryBtnText}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          {secondaryBtnText && (
            <Link href={secondaryBtnHref} className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full text-base sm:text-lg font-semibold bg-background/50 backdrop-blur-md hover:bg-muted transition-colors"
              >
                {secondaryBtnText}
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
