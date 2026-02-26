"use client";

import { useParams } from "next/navigation";
import { ACTIVE_MODULES } from "@/content/es";
import { MODULE_DETAILS } from "@/content/lesson-details";
import { useProgress } from "@/lib/progress";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  PlayCircle,
  Trophy,
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function ModulePage() {
  const params = useParams();
  const id = params.id as string;
  const courseModule = ACTIVE_MODULES.find((m) => m.id === id);
  const detail = courseModule ? MODULE_DETAILS[courseModule.id] : undefined;
  const { getProgress, updateProgress } = useProgress();
  const progress = getProgress("module", id);
  const pct = progress?.percent || 0;

  if (!courseModule) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Módulo no encontrado
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

  const handleStart = () => updateProgress("module", id, Math.max(pct, 10));
  const handleCheckpoint = () => updateProgress("module", id, Math.min(90, Math.max(pct, 60)));
  const handleComplete = () => updateProgress("module", id, 100);

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
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold">
              <BookOpen size={14} />
              Módulo {courseModule.number}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-violet-600 dark:text-violet-300">
              <Sparkles className="w-4 h-4" />
              {courseModule.icon}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">
            {courseModule.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">{courseModule.description}</p>

          {/* Progress bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div
                className="bg-violet-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-300">
              {pct}%
            </span>
          </div>
        </motion.div>

        {/* Topics */}
        <motion.section
          {...fadeIn}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-300" />
            Temas del módulo
          </h2>
          <ul className="space-y-3">
            {courseModule.topics.map((topic, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-violet-500 mt-0.5 shrink-0" />
                <span className="text-slate-700 dark:text-slate-200">{topic}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {detail ? (
          <motion.section
            {...fadeIn}
            className="rounded-2xl border border-indigo-200 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-indigo-950/20 p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-3">Explicación aplicada</h2>
            <p className="text-slate-700 dark:text-slate-200 mb-3">{detail.resumen}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              <span className="font-semibold">Por qué importa: </span>
              {detail.porQueImporta}
            </p>
            <div className="space-y-2">
              {detail.explicacion.map((punto) => (
                <p key={punto} className="text-sm text-slate-700 dark:text-slate-200">
                  • {punto}
                </p>
              ))}
            </div>
          </motion.section>
        ) : null}

        {detail ? (
          <motion.section
            {...fadeIn}
            className="rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/60 dark:bg-sky-950/20 p-6 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Guía paso a paso (hands-on)</h2>
            <ol className="space-y-2 list-decimal list-inside text-sm text-slate-700 dark:text-slate-200">
              {detail.pasos.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <h3 className="font-semibold mt-5 mb-2">Errores comunes</h3>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-200">
              {detail.erroresComunes.map((err) => (
                <li key={err}>• {err}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">
              <span className="font-semibold">Resultado esperado: </span>
              {detail.resultadoEsperado}
            </p>
          </motion.section>
        ) : null}

        {/* Checklist */}
        <motion.section
          {...fadeIn}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Lista de verificación
          </h2>
          <ul className="space-y-3">
            {courseModule.checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                {pct >= 100 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                )}
                <span className="text-slate-700 dark:text-slate-200">{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Project */}
        <motion.section
          {...fadeIn}
          className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 p-6 shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Proyecto integrador
          </h2>
          <p className="text-slate-700 dark:text-slate-200">{courseModule.project}</p>
        </motion.section>

        {/* Actions */}
        <motion.div {...fadeIn} className="flex flex-wrap gap-3">
          {pct === 0 ? (
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white font-semibold px-5 py-3 shadow-lg shadow-violet-500/25 hover:-translate-y-0.5 transition"
            >
              <PlayCircle size={18} />
              Comenzar módulo
            </button>
          ) : pct < 100 ? (
            <>
              <button
                onClick={handleCheckpoint}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-600 text-white font-semibold px-5 py-3 shadow-lg shadow-sky-500/25 hover:-translate-y-0.5 transition"
              >
                Guardar avance
              </button>
              <button
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white font-semibold px-5 py-3 shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition"
              >
                <CheckCircle2 size={18} />
                Completar módulo
              </button>
            </>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold px-6 py-3 border border-emerald-200 dark:border-emerald-800">
              <Trophy size={18} />
              Módulo completado
            </div>
          )}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-5 py-3 hover:border-slate-500 dark:hover:border-slate-500 transition"
          >
            Volver al dashboard
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
