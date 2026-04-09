use client;

import { useState } from react;
import { ArrowLeft, ArrowRight } from lucide-react;
import type { Plantilla } from @/content/plantillas;

interface PromptFormProps {
  plantilla: Plantilla;
  onSubmit: (values: Record<string, string>) => void;
  onBack: () => void;
}

export default function PromptForm({ plantilla, onSubmit, onBack }: PromptFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
  };

  const allRequiredFilled = plantilla.campos
    .filter((c) => c.requerido)
    .every((c) => values[c.id]?.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allRequiredFilled) onSubmit(values);
  };

  return (
    <div>
      <button
        onClick={onBack}
        className=flex items-center gap-1.5 text-sm text-gray-text hover:text-navy mb-4 transition-colors
      >
        <ArrowLeft size={16} />
        Volver
      </button>
      <h2 className=text-lg font-bold text-navy mb-1>{plantilla.nombre}</h2>
      <p className=text-sm text-gray-text mb-6>Completa los datos para generar tu prompt</p>

      {plantilla.nota && (
        <div className=mb-6 p-3 rounded-lg bg-gold/10 border border-gold/30 text-sm text-navy>
          {plantilla.nota}
        </div>
      )}

      <form onSubmit={handleSubmit} className=space-y-4>
        {plantilla.campos.map((campo) => (
          <div key={campo.id}>
            <label htmlFor={campo.id} className=block text-sm font-medium text-navy mb-1.5>
              {campo.label}
              {campo.requerido && <span className=text-red ml-1>*</span>}
            </label>

            {campo.tipo === textarea ? (
              <textarea
                id={campo.id}
                value={values[campo.id] || }
                onChange={(e) => handleChange(campo.id, e.target.value)}
                placeholder={campo.placeholder}
                required={campo.requerido}
                rows={4}
                className=w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
              />
            ) : campo.tipo === select ? (
              <select
                id={campo.id}
                value={values[campo.id] || }
                onChange={(e) => handleChange(campo.id, e.target.value)}
                required={campo.requerido}
                className=w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
              >
                <option value=>Selecciona una opcion...</option>
                {campo.opciones?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                id={campo.id}
                type={campo.tipo}
                value={values[campo.id] || }
                onChange={(e) => handleChange(campo.id, e.target.value)}
                placeholder={campo.placeholder}
                required={campo.requerido}
                className=w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
              />
            )}
          </div>
        ))}

        <button
          type=submit
          disabled={!allRequiredFilled}
          className=w-full flex items-center justify-center gap-2 rounded-xl bg-navy text-white font-semibold py-3 shadow-md hover:-translate-y-0.5 transition disabled:opacity-40 disabled:cursor-not-allowed
        >
          Generar prompt
          <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
