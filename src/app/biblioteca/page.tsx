"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import PromptCard from "@/components/PromptCard";
import { supabase } from "@/lib/supabase";
import { CATEGORIAS } from "@/content/plantillas";

interface PromptRow {
  id: string; categoria: string; tipo: string; prompt_generado: string;
  prompt_mejorado: string | null; es_publico: boolean; created_at: string;
}

export default function BibliotecaPage() {
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");

  useEffect(() => {
    const fetchPublicos = async () => {
      let query = supabase.from("prompts_guardados").select("*").eq("es_publico", true).order("created_at", { ascending: false });
      if (filtro !== "todos") { query = query.eq("categoria", filtro); }
      const { data } = await query;
      setPrompts(data ?? []);
      setLoading(false);
    };
    fetchPublicos();
  }, [filtro]);

  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-navy mb-1">Biblioteca</h1>
        <p className="text-sm text-gray-text mb-6">Prompts compartidos por otros directores del PJENL</p>
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFiltro("todos")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filtro === "todos" ? "bg-navy text-white" : "bg-white border border-gray-200 text-gray-text hover:border-navy"}`}>Todos</button>
          {CATEGORIAS.map((cat) => (
            <button key={cat.id} onClick={() => setFiltro(cat.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filtro === cat.id ? "bg-navy text-white" : "bg-white border border-gray-200 text-gray-text hover:border-navy"}`}>{cat.nombre}</button>
          ))}
        </div>
        {loading ? (
          <p className="text-sm text-gray-text">Cargando...</p>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12 text-gray-text"><p className="text-sm">No hay prompts compartidos aun</p></div>
        ) : (
          <div className="space-y-3">{prompts.map((p) => (<PromptCard key={p.id} {...p} />))}</div>
        )}
      </main>
    </AuthGuard>
  );
}
