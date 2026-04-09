"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Sparkles, Save, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import type { Plantilla } from "@/content/plantillas";

interface PromptPreviewProps {
  plantilla: Plantilla;
  promptGenerado: string;
  campos: Record<string, string>;
  onBack: () => void;
  onReset: () => void;
}

export default function PromptPreview({
  plantilla,
  promptGenerado,
  campos,
  onBack,
  onReset,
}: PromptPreviewProps) {
  const { session } = useAuth();
  const [copied, setCopied] = useState<"original" | "mejorado" | null>(null);
  const [mejorado, setMejorado] = useState<string | null>(null);
  const [mejorando, setMejorando] = useState(false);
  const [restantes, setRestantes] = useState<number | null>(null);
  const [errorMejora, setErrorMejora] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const copyToClipboard = async (text: string, type: "original" | "mejorado") => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleMejorar = async () => {
    if (!session?.access_token) return;
    setMejorando(true);
    setErrorMejora(null);

    try {
      const res = await fetch("/api/mejorar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          prompt: promptGenerado,
          categoria: plantilla.categoria,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMejora(data.error || "Error al mejorar");
        return;
      }

      setMejorado(data.mejorado);
      setRestantes(data.restantes);
    } catch {
      setErrorMejora("Error de conexion");
    } finally {
      setMejorando(false);
    }
  };

  const handleGuardar = async () => {
    if (!session?.user) return;
    setGuardando(true);

    const { error } = await supabase.from("prompts_guardados").insert({
      user_id: session.user.id,
      categoria: plantilla.categoria,
      tipo: plantilla.id,
      campos_completados: campos,
      prompt_generado: promptGenerado,
      prompt_mejorado: mejorado,
      es_publico: false,
    });

    if (!error) setGuardado(true);
    setGuardando(false);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-text hover:text-navy mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver
      </button>

      <h2 className="text-lg font-bold text-navy mb-4">Tu prompt esta listo</h2>

      {plantilla.nota && (
        <div className="mb-4 p-3 rounded-lg bg-gold/10 border border-gold/30 text-sm text-navy">
          {plantilla.nota}
        </div>
      )}

      {/* Original */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-text uppercase tracking-wide">
            {mejorado ? "Original" : "Prompt generado"}
          </span>
          <button
            onClick={() => copyToClipboard(promptGenerado, "original")}
            className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors"
          >
            {copied === "original" ? <Check size={14} className="text-green" /> : <Copy size={14} />}
            {copied === "original" ? "Copiado" : "Copiar"}
          </button>
        </div>
        <pre className="whitespace-pre-wrap text-sm bg-white border border-gray-200 rounded-xl p-4 font-sans">
          {promptGenerado}
        </pre>
      </div>

      {/* Mejorado */}
      {mejorado && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gold uppercase tracking-wide">
              Mejorado con IA
            </span>
            <button
              onClick={() => copyToClipboard(mejorado, "mejorado")}
              className="flex items-center gap-1 text-xs font-medium text-navy hover:text-gold transition-colors"
            >
              {copied === "mejorado" ? <Check size={14} className="text-green" /> : <Copy size={14} />}
              {copied === "mejorado" ? "Copiado" : "Copiar"}
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm bg-navy/5 border border-gold/30 rounded-xl p-4 font-sans">
            {mejorado}
          </pre>
        </motion.div>
      )}

      {errorMejora && (
        <p className="mb-4 text-sm text-red bg-red/10 rounded-lg p-3">{errorMejora}</p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {!mejorado && (
          <button
            onClick={handleMejorar}
            disabled={mejorando}
            className="flex items-center gap-2 rounded-xl bg-gold text-navy-deep font-semibold px-5 py-2.5 text-sm shadow-md hover:-translate-y-0.5 transition disabled:opacity-50"
          >
            {mejorando ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {mejorando ? "Mejorando..." : "Mejorar con IA"}
          </button>
        )}

        <button
          onClick={handleGuardar}
          disabled={guardado || guardando}
          className="flex items-center gap-2 rounded-xl border border-navy text-navy font-semibold px-5 py-2.5 text-sm hover:bg-navy hover:text-white transition disabled:opacity-50"
        >
          {guardado ? <Check size={16} className="text-green" /> : <Save size={16} />}
          {guardado ? "Guardado" : guardando ? "Guardando..." : "Guardar"}
        </button>

        <button
          onClick={onReset}
          className="rounded-xl border border-gray-300 text-gray-text font-medium px-5 py-2.5 text-sm hover:border-navy hover:text-navy transition"
        >
          Nuevo prompt
        </button>
      </div>

      {restantes !== null && (
        <p className="mt-3 text-xs text-gray-text">
          Te quedan {restantes} mejoras con IA hoy
        </p>
      )}
    </div>
  );
}
