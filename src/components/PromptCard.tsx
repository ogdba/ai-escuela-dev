"use client";

import { useState } from "react";
import { Copy, Check, Globe, Lock, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PLANTILLAS, CATEGORIAS } from "@/content/plantillas";

interface PromptCardProps {
  id: string;
  categoria: string;
  tipo: string;
  prompt_generado: string;
  prompt_mejorado: string | null;
  es_publico: boolean;
  created_at: string;
  showControls?: boolean;
  onDelete?: () => void;
}

export default function PromptCard({
  id, categoria, tipo, prompt_generado, prompt_mejorado,
  es_publico, created_at, showControls = false, onDelete,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [publico, setPublico] = useState(es_publico);
  const [expanded, setExpanded] = useState(false);

  const catName = CATEGORIAS.find((c) => c.id === categoria)?.nombre ?? categoria;
  const plantillaName = PLANTILLAS.find((p) => p.id === tipo)?.nombre ?? tipo;
  const bestPrompt = prompt_mejorado || prompt_generado;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bestPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePublico = async () => {
    const newVal = !publico;
    await supabase.from("prompts_guardados").update({ es_publico: newVal }).eq("id", id);
    setPublico(newVal);
  };

  const handleDelete = async () => {
    await supabase.from("prompts_guardados").delete().eq("id", id);
    onDelete?.();
  };

  const fecha = new Date(created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-[10px] font-semibold text-gold uppercase tracking-wide">{catName}</span>
          <h3 className="text-sm font-semibold text-navy">{plantillaName}</h3>
        </div>
        <span className="text-[10px] text-gray-text">{fecha}</span>
      </div>
      <button onClick={() => setExpanded(!expanded)} className="text-xs text-gray-text hover:text-navy transition-colors mb-2">
        {expanded ? "Ocultar" : "Ver prompt"}
      </button>
      {expanded && (
        <pre className="whitespace-pre-wrap text-xs bg-gray-bg rounded-lg p-3 mb-3 font-sans max-h-48 overflow-y-auto">{bestPrompt}</pre>
      )}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <button onClick={handleCopy} className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors">
          {copied ? <Check size={13} className="text-green" /> : <Copy size={13} />}
          {copied ? "Copiado" : "Copiar"}
        </button>
        {showControls && (
          <>
            <button onClick={togglePublico} className="flex items-center gap-1 text-xs font-medium text-gray-text hover:text-navy transition-colors ml-auto">
              {publico ? <Globe size={13} className="text-green" /> : <Lock size={13} />}
              {publico ? "Publico" : "Privado"}
            </button>
            <button onClick={handleDelete} className="flex items-center gap-1 text-xs font-medium text-gray-text hover:text-red transition-colors">
              <Trash2 size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
