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
  fecha: string;
}

const ACTIONS = [
  { href: "/wizard", icon: Wand2, title: "Generar Prompt", description: "Crea un prompt paso a paso con el wizard", color: "bg-gold" },
  { href: "/mis-prompts", icon: BookMarked, title: "Mis Prompts", description: "Revisa y reutiliza tus prompts guardados", color: "bg-navy" },
  { href: "/biblioteca", icon: Library, title: "Biblioteca", description: "Prompts compartidos por otros directores", color: "bg-navy/80" },
  { href: "/prompt-del-dia", icon: Sparkles, title: "Prompt del Dia", description: "Un prompt nuevo cada dia para inspirarte", color: "bg-gold/80" },
  { href: "/tips", icon: Lightbulb, title: "Tips Rapidos", description: "Consejos semanales para usar IA mejor", color: "bg-navy/60" },
  { href: "/faq", icon: HelpCircle, title: "FAQ", description: "Respuestas a preguntas frecuentes sobre IA", color: "bg-navy/40" },
];

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
          <Link href="/prompt-del-dia" className="block mb-6">
            <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-gold/30 bg-gold/5 p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-gold" />
                  <span className="text-xs font-semibold text-gold uppercase tracking-wide">Prompt del Dia</span>
                </div>
                <button onClick={(e) => { e.preventDefault(); handleCopy(); }} className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors">
                  {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <h3 className="text-sm font-semibold text-navy">{promptDia.titulo}</h3>
              <p className="text-xs text-gray-text mt-1 line-clamp-2">{promptDia.prompt_texto}</p>
            </motion.div>
          </Link>
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
