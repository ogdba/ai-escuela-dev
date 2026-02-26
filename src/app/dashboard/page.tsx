"use client";

import { useAuth } from "@/components/AuthProvider";
import { useProgress } from "@/lib/progress";
import { MODULES, LABS } from "@/content/es";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  BookOpen,
  FlaskConical,
  ArrowRight,
  CheckCircle2,
  Clock,
  BarChart3,
  Trophy,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.4 },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { loading, getProgress, globalPercent } = useProgress();

  const modulesWithProgress = MODULES.map((m) => ({
    ...m,
    progress: getProgress("module", m.id),
  }));

  const labsWithProgress = LABS.map((l) => ({
    ...l,
    progress: getProgress("lab", l.id),
  }));

  const modulesInProgress = modulesWithProgress.filter(
    (m) => m.progress && m.progress.percent > 0 && m.progress.percent < 100,
  );
  const modulesCompleted = modulesWithProgress.filter(
    (m) => m.progress && m.progress.percent >= 100,
  );
  const labsPending = labsWithProgress.filter((l) => !l.progress || l.progress.percent < 100);

  const nextModule =
    modulesInProgress[0] || modulesWithProgress.find((m) => !m.progress) || MODULES[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/60 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-50">
      <Navbar />
      <main className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <motion.div {...fadeIn} className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Panel de control
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">
            Bienvenido, {user?.email || "estudiante"}
          </h1>
        </motion.div>

        {/* Global progress */}
        <motion.div
          {...fadeIn}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-6 shadow-lg shadow-violet-500/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-violet-600 dark:text-violet-300" />
              <h2 className="text-lg font-semibold">Progreso global</h2>
            </div>
            <span className="text-2xl font-bold text-violet-600 dark:text-violet-300">
              {loading ? "..." : `${globalPercent}%`}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
            <div
              className="bg-violet-600 dark:bg-violet-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${globalPercent}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {modulesCompleted.length}
              </p>
              <p className="text-slate-500 dark:text-slate-400">Completados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {modulesInProgress.length}
              </p>
              <p className="text-slate-500 dark:text-slate-400">En curso</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {labsPending.length}
              </p>
              <p className="text-slate-500 dark:text-slate-400">Labs pendientes</p>
            </div>
          </div>
        </motion.div>

        {/* Continue learning */}
        {nextModule ? (
          <motion.div {...fadeIn}>
            <Link
              href={`/learn/module/${nextModule.id}`}
              className="flex items-center justify-between rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 p-6 hover:-translate-y-0.5 transition group"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-violet-600 dark:text-violet-300 uppercase tracking-wide">
                  Continuar aprendiendo
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  Módulo {nextModule.number}: {nextModule.title}
                </p>
              </div>
              <ArrowRight className="text-violet-600 dark:text-violet-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ) : null}

        {/* Modules grid */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="text-violet-600 dark:text-violet-300" />
            <h2 className="text-xl font-semibold">Módulos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modulesWithProgress.map((module) => {
              const pct = module.progress?.percent || 0;
              return (
                <motion.div key={module.id} {...fadeIn}>
                  <Link
                    href={`/learn/module/${module.id}`}
                    className="block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 p-5 shadow-md hover:-translate-y-0.5 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500">
                        Módulo {module.number}
                      </span>
                      {pct >= 100 ? (
                        <Trophy className="w-5 h-5 text-amber-500" />
                      ) : pct > 0 ? (
                        <Clock className="w-5 h-5 text-violet-500" />
                      ) : null}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {module.title}
                    </h3>
                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5">
                      <div
                        className="bg-violet-600 h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{pct}% completado</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Labs pending */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FlaskConical className="text-emerald-500" />
            <h2 className="text-xl font-semibold">Labs pendientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {labsPending.slice(0, 9).map((lab) => (
              <motion.div key={lab.id} {...fadeIn}>
                <Link
                  href={`/learn/lab/${lab.id}`}
                  className="block rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 p-5 shadow-md hover:-translate-y-0.5 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                      {lab.title}
                    </span>
                    <span className="text-xs text-gray-500">{lab.duration}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {lab.progress ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : null}
                    <span className="text-xs text-gray-500">{lab.difficulty}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
