"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { HERO } from "@/content/es";

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(17,24,39,0.08),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.12),transparent_28%)]" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20"
            >
              <Sparkles size={16} />
              {HERO.badge}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="space-y-4"
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 dark:text-white leading-tight">
                {HERO.title}{" "}
                <span className="text-slate-900 dark:text-white underline decoration-amber-400 decoration-4 underline-offset-8">
                  {HERO.titleHighlight}
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl">
                {HERO.subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 text-white font-semibold shadow-lg shadow-slate-900/15 hover:-translate-y-0.5 transition"
              >
                {HERO.cta}
                <ArrowRight size={18} />
              </a>
              <a
                href="#modules"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold hover:border-slate-500 dark:hover:border-slate-500 transition"
              >
                {HERO.ctaSecondary}
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none"
            >
              {HERO.stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-3xl font-semibold text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl blur-3xl opacity-20 dark:opacity-30" />
            <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl shadow-slate-200/50 dark:shadow-none p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-semibold">
                  AI
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Preview
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">Panel de Cohorte</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3">
                  <span>Evaluación automática</span>
                  <span className="text-emerald-600 font-medium">Green</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3">
                  <span>Costo por 1k tokens</span>
                  <span className="font-medium text-slate-900 dark:text-white">$0.0012</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3">
                  <span>Tiempo de respuesta</span>
                  <span className="font-medium text-slate-900 dark:text-white">320 ms P50</span>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50 dark:bg-slate-900/40">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    RAG QA
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">Docs de pagos</p>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">
                    Precisión 92% • Cobertura 97%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
