"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";

interface PromptDia {
  id: string;
  titulo: string;
  categoria: string;
  prompt_texto: string;
  ejemplo_uso: string;
  fecha: string;
}

export default function PromptDelDiaPage() {
  const [prompt, setPrompt] = useState<PromptDia | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/prompt-del-dia")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { setPrompt(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt.prompt_texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const catColors: Record<string, string> = {
    analizar: "bg-blue-100 text-blue-800",
    generar: "bg-emerald-100 text-emerald-800",
    datos: "bg-purple-100 text-purple-800",
    comunicar: "bg-amber-100 text-amber-800",
    presentaciones: "bg-rose-100 text-rose-800",
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={20} className="text-gold" />
          <h1 className="text-xl font-bold text-navy">Prompt del Dia</h1>
        </div>

        {loading ? (
          <p className="text-sm text-gray-text">Cargando...</p>
        ) : !prompt ? (
          <div className="text-center py-12 text-gray-text">
            <p className="text-sm">Aun no hay prompts generados. Vuelve manana.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${catColors[prompt.categoria] || "bg-gray-100 text-gray-800"}`}>
                  {prompt.categoria}
                </span>
                <span className="text-xs text-gray-text">
                  {new Date(prompt.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-navy mb-4">{prompt.titulo}</h2>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-text uppercase tracking-wide">Prompt</span>
                  <button onClick={handleCopy} className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors">
                    {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                    {copied ? "Copiado" : "Copiar"}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-gray-bg border border-gray-200 rounded-xl p-4 font-sans">{prompt.prompt_texto}</pre>
              </div>

              <div>
                <span className="text-xs font-semibold text-gold uppercase tracking-wide">Como usarlo</span>
                <p className="mt-2 text-sm text-gray-700">{prompt.ejemplo_uso}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
