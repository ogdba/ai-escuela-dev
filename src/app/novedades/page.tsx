"use client";

import { useState } from "react";
import { Newspaper, ChevronDown, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { NOVEDADES } from "@/content/novedades";

export default function NovedadesPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Newspaper size={20} className="text-gold" />
          <h1 className="text-xl font-bold text-navy">Novedades</h1>
        </div>
        <p className="text-sm text-gray-text mb-6">Noticias y articulos relevantes sobre IA</p>

        <div className="space-y-4">
          {NOVEDADES.map((nota) => (
            <div key={nota.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenId(openId === nota.id ? null : nota.id)}
                className="w-full p-5 text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-1.5">
                    {nota.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-navy/5 text-navy">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-text shrink-0 transition-transform ${openId === nota.id ? "rotate-180" : ""}`}
                  />
                </div>
                <h2 className="text-base font-semibold text-navy mt-2">{nota.titulo}</h2>
                <p className="text-sm text-gray-700 mt-2">{nota.resumen}</p>
                <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-text">
                  <span>{new Date(nota.fecha).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span>·</span>
                  <span>Fuente: {nota.fuente}</span>
                </div>
              </button>

              {openId === nota.id && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <div className="mt-4">
                    {nota.contenido.split("\n\n").map((paragraph, i) => {
                      if (paragraph.startsWith("## ")) {
                        return <h3 key={i} className="text-sm font-bold text-navy mt-5 mb-2">{paragraph.replace("## ", "")}</h3>;
                      }
                      const parts = paragraph.split(/\*\*(.*?)\*\*/g);
                      return (
                        <p key={i} className="text-sm text-gray-700 mb-3 leading-relaxed">
                          {parts.map((part, j) =>
                            j % 2 === 1 ? <strong key={j} className="text-navy">{part}</strong> : part
                          )}
                        </p>
                      );
                    })}
                  </div>
                  <a
                    href={nota.fuente_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:underline"
                  >
                    Ver fuente original <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
