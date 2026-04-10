"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wand2, BookMarked, Library, Sparkles, Lightbulb, HelpCircle, Copy, Check } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

interface PromptDia {
  titulo: string;
  categoria: string;
  prompt_texto: string;
  ejemplo_uso: string;
  fecha: string;
}

const ACTIONS = [
  { href: "/wizard", icon: Wand2, title: "Generar Prompt", description: "Crea un prompt paso a paso con el wizard", color: "bg-gold" },
  { href: "/mis-prompts", icon: BookMarked, title: "Mis Prompts", description: "Revisa y reutiliza tus prompts guardados", color: "bg-navy" },
  { href: "/biblioteca", icon: Library, title: "Biblioteca", description: "Prompts compartidos por otros directores", color: "bg-navy/80" },
  { href: "/tips", icon: Lightbulb, title: "Tips Rapidos", description: "Consejos semanales para usar IA mejor", color: "bg-navy/60" },
  { href: "/faq", icon: HelpCircle, title: "FAQ", description: "Respuestas a preguntas frecuentes sobre IA", color: "bg-navy/40" },
];

const catColors: Record<string, string> = {
  analizar: "bg-blue-100 text-blue-800",
  generar: "bg-emerald-100 text-emerald-800",
  datos: "bg-purple-100 text-purple-800",
  comunicar: "bg-amber-100 text-amber-800",
  presentaciones: "bg-rose-100 text-rose-800",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [promptDia, setPromptDia] = useState<PromptDia | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/prompt-del-dia")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPromptDia(data))
      .catch(() => {});
  }, []);

  const handleCopy = async () => {
    if (!promptDia) return;
    await navigator.clipboard.writeText(promptDia.prompt_texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy">Bienvenido/a</h1>
          <p className="text-sm text-gray-text mt-1">{user?.email} — Generador de Prompts PJENL</p>
        </div>

        {promptDia && (
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-gold" />
                <span className="text-xs font-semibold text-gold uppercase tracking-wide">Prompt del Dia</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${catColors[promptDia.categoria] || "bg-gray-100 text-gray-800"}`}>
                  {promptDia.categoria}
                </span>
                <span className="text-xs text-gray-text">
                  {new Date(promptDia.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-navy mb-4">{promptDia.titulo}</h2>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-text uppercase tracking-wide">Prompt</span>
                  <button onClick={handleCopy} className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors">
                    {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-gray-bg border border-gray-200 rounded-xl p-4 font-sans">{promptDia.prompt_texto}</pre>
              </div>
              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-wide">Como usarlo</span>
                <p className="mt-2 text-sm text-gray-700">{promptDia.ejemplo_uso}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ACTIONS.map(({ href, icon: Icon, title, description, color }) => (
            <motion.div key={href} whileHover={{ y: -3 }}>
              <Link href={href} className="block p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-gold transition-all">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h2 className="font-semibold text-navy text-sm">{title}</h2>
                <p className="text-xs text-gray-text mt-1">{description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </>
  );
}
