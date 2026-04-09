"use client";

import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Tip {
  id: string;
  titulo: string;
  contenido: string;
  created_at: string;
}

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tips")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => { setTips(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb size={20} className="text-gold" />
          <h1 className="text-xl font-bold text-navy">Tips Rapidos</h1>
        </div>

        {loading ? (
          <p className="text-sm text-gray-text">Cargando...</p>
        ) : tips.length === 0 ? (
          <div className="text-center py-12 text-gray-text">
            <p className="text-sm">Aun no hay tips. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tips.map((tip) => (
              <div key={tip.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Lightbulb size={16} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-navy">{tip.titulo}</h3>
                    <p className="text-sm text-gray-700 mt-1">{tip.contenido}</p>
                    <span className="text-[10px] text-gray-text mt-2 inline-block">
                      {new Date(tip.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
