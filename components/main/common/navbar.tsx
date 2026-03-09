"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { mainRoutes } from "@/routes/main-routes";
import { authTokenStorage } from "@/lib/axios-instance";
import { LoggedProfile } from "@/components/globals/profile/logged-profile";

export function Navbar() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(authTokenStorage.getAccessToken()));
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: smoothEase }}
        className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-border/40 bg-background/70 px-4 backdrop-blur-xl md:px-8"
      >
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40">
              R
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-bold tracking-tight text-transparent">
              RTM Class<span className="text-primary">.ai</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {mainRoutes.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`group relative text-sm font-medium transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-primary transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            {isLoggedIn ? (
              <LoggedProfile />
            ) : (
              <Button
                asChild
                className="hidden md:inline-flex rounded-full px-6 font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/40"
              >
                <Link href="/auth/sign-up">
                  Get Started
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: smoothEase }}
            className="fixed inset-0 z-[60] flex min-h-screen flex-col bg-background/96 px-5 pb-8 pt-6 backdrop-blur-2xl md:hidden"
          >
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between pb-7">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                  R
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                  RTM Class<span className="text-primary">.ai</span>
                </span>
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Close menu"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
              <div className="space-y-2">
                {mainRoutes.map((link, index) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 + index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-lg font-semibold transition-colors ${
                          isActive
                            ? "border-primary/30 bg-primary/12 text-primary"
                            : "border-border/60 text-foreground hover:bg-muted/70"
                        }`}
                      >
                        {link.name}
                        {isActive && (
                          <motion.span
                            layoutId="active-mobile-pill"
                            className="h-2.5 w-2.5 rounded-full bg-primary"
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {!isLoggedIn && (
                <Button
                  asChild
                  className="mt-auto h-14 w-full rounded-2xl text-base font-semibold"
                >
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
