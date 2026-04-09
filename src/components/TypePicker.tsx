use client;

import { motion } from framer-motion;
import { ArrowLeft } from lucide-react;
import { PLANTILLAS, type Plantilla, type Categoria } from @/content/plantillas;

interface TypePickerProps {
  categoria: Categoria;
  onSelect: (plantilla: Plantilla) => void;
  onBack: () => void;
}

export default function TypePicker({ categoria, onSelect, onBack }: TypePickerProps) {
  const filtered = PLANTILLAS.filter((p) => p.categoria === categoria.id);

  return (
    <div>
      <button
        onClick={onBack}
        className=flex items-center gap-1.5 text-sm text-gray-text hover:text-navy mb-4 transition-colors
      >
        <ArrowLeft size={16} />
        Volver
      </button>
      <h2 className=text-lg font-bold text-navy mb-1>{categoria.nombre}</h2>
      <p className=text-sm text-gray-text mb-6>Selecciona el tipo de prompt</p>
      <div className=grid grid-cols-1 gap-3>
        {filtered.map((plantilla) => (
          <motion.button
            key={plantilla.id}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(plantilla)}
            className=flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gold hover:shadow-md transition-all text-left
          >
            <div>
              <h3 className=font-semibold text-navy text-sm>{plantilla.nombre}</h3>
              <p className=text-xs text-gray-text mt-0.5>{plantilla.descripcion}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
