"use client";

import { useParams } from "next/navigation";
import { MODULES } from "@/content/es";
import { getLesson, getLessonsForModule } from "@/content/lessons";
import { useProgress } from "@/lib/progress";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Code2,
  Lightbulb,
  PenTool,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function LessonPage() {
  const params = useParams();
  const moduleId = params.id as string;
  const lessonId = params.lessonId as string;

  const courseModule = MODULES.find((m) => m.id === moduleId);
  const lesson = getLesson(moduleId, lessonId);
  const allLessons = getLessonsForModule(moduleId);
  const { getProgress, updateProgress } = useProgress();
  const progress = getProgress("lesson", lessonId);
  const pct = progress?.percent || 0;

  const [showSolution, setShowSolution] = useState(false);
  const [showHints, setShowHints] = useState(false);

  if (!courseModule || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Lección no encontrada
          </h1>
          <Link
            href={`/learn/module/${moduleId}`}
            className="inline-flex items-center gap-2 text-violet-600 hover:underline"
          >
            <ArrowLeft size={16} /> Volver al módulo
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleComplete = () => updateProgress("lesson", lessonId, 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/60 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-50">
      <Navbar />
      <main className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/dashboard" className="hover:text-violet-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link
            href={`/learn/module/${moduleId}`}
            className="hover:text-violet-600 transition-colors"
          >
            Módulo {courseModule.number}
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-200">Lección {lesson.number}</span>
        </div>

        {/* Header */}
        <motion.div {...fadeIn} className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold">
              <BookOpen size={14} />
              Lección {lesson.number} de {allLessons.length}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs">
              <Clock size={14} />
              {lesson.duration}
            </span>
            {pct >= 100 && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <CheckCircle2 size={14} />
                Completada
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">
            {lesson.title}
          </h1>
        </motion.div>

        {/* Objectives */}
        <motion.section
          {...fadeIn}
          className="rounded-2xl border border-violet-200 dark:border-violet-900/40 bg-violet-50/60 dark:bg-violet-950/20 p-6 shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-600 dark:text-violet-300" />
            Objetivos de aprendizaje
          </h2>
          <ul className="space-y-2">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                <span className="text-slate-700 dark:text-slate-200">{obj}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Sections */}
        {lesson.sections.map((section, i) => (
          <motion.section
            key={i}
            {...fadeIn}
            className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 p-6 shadow-lg space-y-4"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>

            <div className="space-y-3">
              {section.content.map((paragraph, j) => (
                <p key={j} className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  {paragraph}
                </p>
              ))}
            </div>

            {section.code && (
              <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <Code2 size={14} />
                  {section.code.language}
                  {section.code.caption && (
                    <span className="ml-auto text-slate-500 dark:text-slate-400">
                      {section.code.caption}
                    </span>
                  )}
                </div>
                <pre className="p-4 overflow-x-auto text-sm bg-slate-50 dark:bg-slate-900">
                  <code className="text-slate-800 dark:text-slate-200 whitespace-pre">
                    {section.code.code}
                  </code>
                </pre>
              </div>
            )}

            {section.tip && (
              <div className="mt-4 flex gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-4">
                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 dark:text-amber-200">{section.tip}</p>
              </div>
            )}
          </motion.section>
        ))}

        {/* Exercise */}
        <motion.section
          {...fadeIn}
          className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 shadow-lg space-y-4"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <PenTool className="w-5 h-5 text-emerald-600 dark:text-emerald-300" />
            Ejercicio práctico
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {lesson.exercise.instruction}
          </p>

          {/* Hints */}
          <button
            onClick={() => setShowHints(!showHints)}
            className="inline-flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 hover:underline"
          >
            {showHints ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showHints ? "Ocultar pistas" : `Ver ${lesson.exercise.hints.length} pistas`}
          </button>
          {showHints && (
            <ul className="space-y-2 pl-4 border-l-2 border-emerald-300 dark:border-emerald-700">
              {lesson.exercise.hints.map((hint, i) => (
                <li key={i} className="text-sm text-slate-600 dark:text-slate-300">
                  💡 {hint}
                </li>
              ))}
            </ul>
          )}

          {/* Solution */}
          {lesson.exercise.solution && (
            <>
              <button
                onClick={() => setShowSolution(!showSolution)}
                className="inline-flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 hover:underline"
              >
                {showSolution ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showSolution ? "Ocultar solución" : "Ver solución"}
              </button>
              {showSolution && (
                <div className="rounded-xl border border-emerald-200 dark:border-emerald-700 overflow-hidden">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-xs text-emerald-700 dark:text-emerald-300 border-b border-emerald-200 dark:border-emerald-700 flex items-center gap-2">
                    <Code2 size={14} />
                    Solución — {lesson.exercise.solution.language}
                  </div>
                  <pre className="p-4 overflow-x-auto text-sm bg-emerald-50/50 dark:bg-emerald-950/20">
                    <code className="text-slate-800 dark:text-slate-200 whitespace-pre">
                      {lesson.exercise.solution.code}
                    </code>
                  </pre>
                </div>
              )}
            </>
          )}
        </motion.section>

        {/* Actions */}
        <motion.div {...fadeIn} className="flex flex-wrap items-center gap-3">
          {pct < 100 ? (
            <button
              onClick={handleComplete}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white font-semibold px-5 py-3 shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 transition"
            >
              <CheckCircle2 size={18} />
              Marcar como completada
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold px-5 py-3 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 size={18} />
              Lección completada
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <motion.div
          {...fadeIn}
          className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800"
        >
          {prevLesson ? (
            <Link
              href={`/learn/module/${moduleId}/lesson/${prevLesson.id}`}
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>
                <span className="text-xs text-slate-400 block">Anterior</span>
                {prevLesson.title}
              </span>
            </Link>
          ) : (
            <Link
              href={`/learn/module/${moduleId}`}
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-violet-600 transition-colors"
            >
              <ArrowLeft size={16} /> Volver al módulo
            </Link>
          )}

          {nextLesson ? (
            <Link
              href={`/learn/module/${moduleId}/lesson/${nextLesson.id}`}
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-right"
            >
              <span>
                <span className="text-xs text-slate-400 block">Siguiente</span>
                {nextLesson.title}
              </span>
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              href={`/learn/module/${moduleId}`}
              className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:underline"
            >
              Finalizar módulo <ArrowRight size={16} />
            </Link>
          )}
        </motion.div>
      </main>
    </div>
  );
}
