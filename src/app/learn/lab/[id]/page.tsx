"use client";

import { useParams } from "next/navigation";
import { LABS, MODULES } from "@/content/es";
import { useProgress } from "@/lib/progress";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FlaskConical,
  PlayCircle,
  CheckCircle2,
  Clock,
  BarChart3,
  Tag,
  BookOpen,
  Trophy,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const difficultyColor: Record<string, string> = {
  fácil: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  medio: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  difícil: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  experto: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

export default function LabPage() {
  const params = useParams();
  const id = params.id as string;
  const lab = LABS.find((l) => l.id === id);
  const { getProgress, updateProgress } = useProgress();
  const progress = getProgress("lab", id);
  const pct = progress?.percent || 0;

  if (!lab) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Laboratorio no encontrado
          </h1>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-violet-600 hover:underline"
          >
            <ArrowLeft size={16} /> Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  const relatedModule = MODULES.find((m) => m.id === lab.module);
  const handleStart = () => updateProgress("lab", id, 10);
  const handleComplete = () => updateProgress("lab", id, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/60 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-50">
      <Navbar />
      <main className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>

        {/* Header */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <FlaskConical size={14} />
              Laboratorio
            </span>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${difficultyColor[lab.difficulty] || ""}`}
            >
              <BarChart3 size={12} />
              {lab.difficulty}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold">
              <Clock size={12} />
              {lab.duration}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">
            {lab.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">{lab.description}</p>

          {/* Progress */}
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
              {pct}%
            </span>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.section
          {...fadeIn}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 p-6 shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-500" />
            Etiquetas
          </h2>
          <div className="flex flex-wrap gap-2">
            {lab.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-100 px-3 py-1.5 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Related module */}
        {relatedModule ? (
          <motion.div {...fadeIn}>
            <Link
              href={`/learn/module/${relatedModule.id}`}
              className="flex items-center justify-between rounded-2xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 p-5 hover:-translate-y-0.5 transition group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-300" />
                <div>
                  <p className="text-xs text-violet-600 dark:text-violet-300 font-semibold">
                    Módulo relacionado
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {relatedModule.title}
                  </p>
                </div>
              </div>
              <ArrowLeft className="text-violet-600 rotate-180 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ) : null}

        {/* Actions */}
        <motion.div {...fadeIn} className="flex gap-4">
          {pct === 0 ? (
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white font-semibold px-6 py-3 shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition"
            >
              <PlayCircle size={18} />
              Iniciar laboratorio
            </button>
          ) : pct < 100 ? (
            <button
              onClick={handleComplete}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white font-semibold px-6 py-3 shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition"
            >
              <CheckCircle2 size={18} />
              Marcar como completado
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold px-6 py-3 border border-emerald-200 dark:border-emerald-800">
              <Trophy size={18} />
              Lab completado
            </div>
          )}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3 hover:border-slate-500 dark:hover:border-slate-500 transition"
          >
            Volver al dashboard
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
