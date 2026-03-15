"use client";

import { motion } from "framer-motion";

export function InteractiveDemo() {
  const smoothEase = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="py-32 px-4 md:px-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] -z-10 rounded-full w-[600px] h-[600px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="text-3xl md:text-5xl font-bold tracking-tighter mb-16 text-center"
        >
          Built for Daily Teaching Operations.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: smoothEase }}
          className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)] relative"
        >
          <div className="h-12 bg-[#121212] border-b border-white/5 flex items-center justify-between px-4">
            <div className="flex gap-2 w-20">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-white/10" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-white/10" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-white/10" />
            </div>
            <div className="text-[11px] text-white/50 font-mono tracking-widest uppercase font-medium bg-white/5 px-3 py-1 rounded-md border border-white/5">
              Class Workflow Snapshot
            </div>
            <div className="w-20" />{" "}
          </div>

          <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 relative">
            <div className="flex-1 font-mono text-[13px] md:text-sm leading-relaxed">
              <div className="text-white/40 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Teacher action
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="bg-white/[0.02] p-5 rounded-xl border border-white/5"
              >
                <pre className="m-0">
                  <code>
                    <span className="text-zinc-500">{`{\n`}</span>
                    <span className="text-blue-300"> "user_id"</span>
                    <span className="text-zinc-500">{`: `}</span>
                    <span className="text-green-300">"teacher_102"</span>
                    <span className="text-zinc-500">{`,\n`}</span>
                    <span className="text-blue-300"> "class_id"</span>
                    <span className="text-zinc-500">{`: `}</span>
                    <span className="text-green-300">"class_xi_science_1"</span>
                    <span className="text-zinc-500">{`,\n`}</span>
                    <span className="text-blue-300"> "action"</span>
                    <span className="text-zinc-500">{`: `}</span>
                    <span className="text-green-300">"publish_assignment"</span>
                    <span className="text-zinc-500">{`,\n`}</span>
                    <span className="text-blue-300"> "assignment_type"</span>
                    <span className="text-zinc-500">{`: `}</span>
                    <span className="text-green-300">"QUIZ_MCQ"</span>
                    <span className="text-zinc-500">{`,\n`}</span>
                    <span className="text-blue-300"> "due_at"</span>
                    <span className="text-zinc-500">{`: `}</span>
                    <span className="text-green-300">"2026-03-20T09:00:00Z"</span>
                    <span className="text-zinc-500">{`\n}`}</span>
                  </code>
                </pre>
              </motion.div>
            </div>

            <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <div className="flex-1 font-mono text-[13px] md:text-sm leading-relaxed">
              <div className="text-white/40 mb-4 flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Platform result
              </div>
              <motion.div
                initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.8, duration: 0.6, ease: smoothEase }}
                className="bg-green-500/[0.03] p-5 rounded-xl border border-green-500/10"
              >
                <pre className="m-0 whitespace-pre-wrap">
                  <code>
                    <span className="text-zinc-500">{`{\n`}</span>
                    <span className="text-blue-300"> "success"</span>
                    <span className="text-zinc-500">{`: `}</span>
                    <span className="text-purple-400">true</span>
                    <span className="text-zinc-500">{`,\n`}</span>
                    <span className="text-blue-300"> "summary"</span>
                    <span className="text-zinc-500">{`: {\n\t`}</span>
                    <span className="text-blue-300"> "status"</span>
                    <span className="text-zinc-500">{`: `}</span>
                    <span className="text-green-300">"published"</span>
                    <span className="text-zinc-500">{`,\n\t`}</span>
                    <span className="text-blue-300"> "submissions"</span>
                    <span className="text-zinc-500">{`: `}</span>
                    <span className="text-orange-300">0</span>
                    <span className="text-zinc-500">{`\n  },\n`}</span>
                    <span className="text-blue-300"> "message"</span>
                    <span className="text-zinc-500">{`: `}</span>
                    <span className="text-green-300">
                      "Assignment is now visible to students."
                    </span>
                    <span className="text-zinc-500">{`\n}`}</span>
                  </code>
                </pre>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
