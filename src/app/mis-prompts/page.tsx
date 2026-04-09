"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PromptCard from "@/components/PromptCard";

interface PromptRow {
  id: string; categoria: string; tipo: string; prompt_generado: string;
  prompt_mejorado: string | null; es_publico: boolean; created_at: string;
}

export default function MisPromptsPage() {
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPrompts = async () => {
    const res = await fetch("/api/prompts");
    if (res.ok) {
      const data = await res.json();
      setPrompts(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPrompts(); }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-navy mb-1">Mis Prompts</h1>
        <p className="text-sm text-gray-text mb-6">Tus prompts guardados. Usa el toggle para compartirlos en la biblioteca.</p>
        {loading ? (
          <p className="text-sm text-gray-text">Cargando...</p>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12 text-gray-text">
            <p className="text-sm">Aun no tienes prompts guardados</p>
            <a href="/wizard" className="text-sm text-gold font-semibold hover:underline mt-2 inline-block">Genera tu primer prompt</a>
          </div>
        ) : (
          <div className="space-y-3">
            {prompts.map((p) => (<PromptCard key={p.id} {...p} showControls onDelete={fetchPrompts} />))}
          </div>
        )}
      </main>
    </>
  );
}
