"use client";

import { useState, type FormEvent } from "react";
import { ACTIVE_MODULES, ACTIVE_LABS } from "@/content/es";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Plus, BookOpen, FlaskConical, Settings, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

interface NewContentForm {
  id: string;
  title: string;
  description: string;
  contentType: "module" | "lab";
}

export default function AdminContentPage() {
  const [tab, setTab] = useState<"modules" | "labs">("modules");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<NewContentForm>({
    id: "",
    title: "",
    description: "",
    contentType: "module",
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaved(false);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl) {
        const session = localStorage.getItem("ai-escuela-auth");
        const token = session ? JSON.parse(session).accessToken : null;
        const restUrl = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/content_items`;
        await fetch(restUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            Authorization: token ? `Bearer ${token}` : "",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            id: formData.id,
            content_type: formData.contentType,
            title: formData.title,
            description: formData.description,
          }),
        });
      }
    } catch {
      // Best effort – in dev mode content is managed via es.ts
    }

    setSaved(true);
    setFormData({ id: "", title: "", description: "", contentType: "module" });
    setTimeout(() => {
      setSaved(false);
      setShowForm(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/60 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-50">
      <Navbar />
      <main className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          <ArrowLeft size={16} /> Volver al dashboard
        </Link>

        <motion.div {...fadeIn} className="space-y-2">
          <div className="flex items-center gap-3">
            <Settings className="text-violet-600 dark:text-violet-300" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Administrador
              </p>
              <h1 className="font-display text-3xl font-semibold text-slate-900 dark:text-white">
                Gestión de Contenido
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab("modules")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              tab === "modules"
                ? "bg-violet-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            <BookOpen size={16} />
            Módulos ({ACTIVE_MODULES.length})
          </button>
          <button
            onClick={() => setTab("labs")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              tab === "labs"
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            <FlaskConical size={16} />
            Labs ({ACTIVE_LABS.length})
          </button>
          <button
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                contentType: tab === "modules" ? "module" : "lab",
              }));
              setShowForm(!showForm);
            }}
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:-translate-y-0.5 transition"
          >
            <Plus size={16} />
            Agregar {tab === "modules" ? "módulo" : "laboratorio"}
          </button>
        </div>

        {/* Add form */}
        {showForm ? (
          <motion.form
            {...fadeIn}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xl space-y-4"
          >
            <h3 className="font-semibold text-lg">
              Nuevo {formData.contentType === "module" ? "módulo" : "laboratorio"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="content-id"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  ID (slug)
                </label>
                <input
                  id="content-id"
                  value={formData.id}
                  onChange={(e) => setFormData((p) => ({ ...p, id: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  required
                  placeholder="ej: mi-nuevo-modulo"
                />
              </div>
              <div>
                <label
                  htmlFor="content-title"
                  className="text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Título
                </label>
                <input
                  id="content-title"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="content-desc"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Descripción
              </label>
              <textarea
                id="content-desc"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm min-h-[80px] focus:ring-2 focus:ring-violet-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 text-white font-semibold px-5 py-2.5 text-sm shadow-lg shadow-violet-500/20 hover:-translate-y-0.5 transition"
              >
                <CheckCircle2 size={16} />
                Guardar
              </button>
              {saved ? (
                <span className="text-sm text-emerald-600 font-semibold">Guardado</span>
              ) : null}
            </div>
          </motion.form>
        ) : null}

        {/* Content table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 shadow-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
                <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  {tab === "modules" ? "#" : "Dificultad"}
                </th>
                <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">
                  Título
                </th>
                <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">
                  {tab === "modules" ? "Temas" : "Duración"}
                </th>
                <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300 hidden md:table-cell">
                  ID
                </th>
              </tr>
            </thead>
            <tbody>
              {tab === "modules"
                ? ACTIVE_MODULES.map((m) => (
                    <tr
                      key={m.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-5 py-3 text-slate-500">{m.number}</td>
                      <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                        {m.title}
                      </td>
                      <td className="px-5 py-3 text-slate-500 hidden md:table-cell">
                        {m.topics.length} temas
                      </td>
                      <td className="px-5 py-3 text-slate-400 font-mono text-xs hidden md:table-cell">
                        {m.id}
                      </td>
                    </tr>
                  ))
                : ACTIVE_LABS.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="text-xs font-semibold">{l.difficulty}</span>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">
                        {l.title}
                      </td>
                      <td className="px-5 py-3 text-slate-500 hidden md:table-cell">
                        {l.duration}
                      </td>
                      <td className="px-5 py-3 text-slate-400 font-mono text-xs hidden md:table-cell">
                        {l.id}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
