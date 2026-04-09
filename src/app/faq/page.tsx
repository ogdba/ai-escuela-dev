"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import { FAQ_ITEMS } from "@/content/faq";

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle size={20} className="text-gold" />
          <h1 className="text-xl font-bold text-navy">Preguntas Frecuentes</h1>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="text-sm font-semibold text-navy pr-4">{item.pregunta}</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-text shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
                />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 pt-0">
                  <p className="text-sm text-gray-700">{item.respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
