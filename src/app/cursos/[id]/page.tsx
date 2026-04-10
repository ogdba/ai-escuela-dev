"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ChevronDown, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { CURSOS } from "@/content/cursos";
import { CURSOS_CONTENIDO } from "@/content/curso-contenido";

export default function CursoDetallePage() {
  const params = useParams();
  const cursoId = params.id as string;
  const curso = CURSOS.find((c) => c.id === cursoId);
  const contenido = CURSOS_CONTENIDO.find((c) => c.cursoId === cursoId);
  const [openModulo, setOpenModulo] = useState<string | null>(contenido?.modulos[0]?.id || null);
  const [openLeccion, setOpenLeccion] = useState<string | null>(contenido?.modulos[0]?.lecciones[0]?.id || null);

  if (!curso) {
    return (
      <>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-sm text-gray-text">Curso no encontrado</p>
        </main>
      </>
    );
  }

  // If no in-platform content, show info card with external link
  if (!contenido) {
    return (
      <>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <Link href="/cursos" className="flex items-center gap-1.5 text-sm text-gray-text hover:text-navy mb-6 transition-colors">
            <ArrowLeft size={16} /> Volver a cursos
          </Link>
          <h1 className="text-xl font-bold text-navy mb-2">{curso.titulo}</h1>
          <p className="text-sm text-gray-700 mb-6">{curso.descripcion}</p>
          <a href={curso.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-navy text-white font-semibold px-5 py-3 text-sm hover:-translate-y-0.5 transition">
            Ir al curso en Anthropic Academy
          </a>
        </main>
      </>
    );
  }

  const renderContent = (text: string) => {
    return text.split("\n\n").map((paragraph, i) => {
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
    });
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/cursos" className="flex items-center gap-1.5 text-sm text-gray-text hover:text-navy mb-6 transition-colors">
          <ArrowLeft size={16} /> Volver a cursos
        </Link>

        <h1 className="text-xl font-bold text-navy mb-1">{curso.titulo}</h1>
        <p className="text-sm text-gray-text mb-6">{curso.descripcion}</p>

        <div className="space-y-3">
          {contenido.modulos.map((modulo, mi) => (
            <div key={modulo.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenModulo(openModulo === modulo.id ? null : modulo.id)}
                className="w-full p-4 text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gold">{mi + 1}</span>
                  <div>
                    <h2 className="text-sm font-semibold text-navy">{modulo.titulo}</h2>
                    <p className="text-xs text-gray-text mt-0.5">{modulo.descripcion}</p>
                  </div>
                </div>
                <ChevronDown size={16} className={`text-gray-text shrink-0 transition-transform ${openModulo === modulo.id ? "rotate-180" : ""}`} />
              </button>

              {openModulo === modulo.id && (
                <div className="border-t border-gray-100">
                  {modulo.lecciones.map((leccion, li) => (
                    <div key={leccion.id} className="border-b border-gray-50 last:border-b-0">
                      <button
                        onClick={() => setOpenLeccion(openLeccion === leccion.id ? null : leccion.id)}
                        className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
                      >
                        <BookOpen size={14} className="text-gray-text shrink-0" />
                        <span className="text-xs text-gray-text">{mi + 1}.{li + 1}</span>
                        <span className="text-sm text-navy">{leccion.titulo}</span>
                        <ChevronDown size={14} className={`text-gray-text shrink-0 ml-auto transition-transform ${openLeccion === leccion.id ? "rotate-180" : ""}`} />
                      </button>

                      {openLeccion === leccion.id && (
                        <div className="px-6 pb-5 pt-2">
                          {renderContent(leccion.contenido)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-gold/5 border border-gold/20">
          <p className="text-xs text-gray-text">
            Para profundizar en este tema, puedes tomar el curso completo en{" "}
            <a href={curso.url} target="_blank" rel="noopener noreferrer" className="text-gold font-semibold hover:underline">
              Anthropic Academy
            </a>
            {" "}(incluye videos y certificado).
          </p>
        </div>
      </main>
    </>
  );
}
