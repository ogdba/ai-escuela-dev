"use client";

import { GraduationCap, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { CURSOS } from "@/content/cursos";

const nivelColors: Record<string, string> = {
  basico: "bg-emerald-100 text-emerald-800",
  intermedio: "bg-blue-100 text-blue-800",
  avanzado: "bg-purple-100 text-purple-800",
};

const nivelLabels: Record<string, string> = {
  basico: "Basico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

export default function CursosPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap size={20} className="text-gold" />
          <h1 className="text-xl font-bold text-navy">Cursos</h1>
        </div>
        <p className="text-sm text-gray-text mb-6">
          Cursos gratuitos de Anthropic Academy para aprender a usar IA de manera efectiva
        </p>

        <div className="space-y-3">
          {CURSOS.map((curso) => (
            <motion.a
              key={curso.id}
              href={curso.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-gold transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-text">#{curso.numero}</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${nivelColors[curso.nivel]}`}>
                    {nivelLabels[curso.nivel]}
                  </span>
                  {curso.gratuito && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gold/10 text-gold">
                      Gratis
                    </span>
                  )}
                </div>
                <ExternalLink size={14} className="text-gray-text shrink-0" />
              </div>
              <h2 className="text-sm font-semibold text-navy">{curso.titulo}</h2>
              <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">{curso.descripcion}</p>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 p-4 rounded-xl bg-navy/5 border border-navy/10">
          <p className="text-xs text-gray-text">
            Todos los cursos son proporcionados por <strong className="text-navy">Anthropic Academy</strong> y se abren en una ventana externa. Son gratuitos y requieren crear una cuenta en Skilljar.
          </p>
        </div>
      </main>
    </>
  );
}
