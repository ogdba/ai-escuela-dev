use client;

import { motion } from framer-motion;
import {
  FileSearch,
  FilePlus,
  BarChart3,
  MessageSquare,
  Presentation,
} from lucide-react;
import { CATEGORIAS, type Categoria } from @/content/plantillas;

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  FileSearch,
  FilePlus,
  BarChart3,
  MessageSquare,
  Presentation,
};

interface CategoryPickerProps {
  onSelect: (categoria: Categoria) => void;
}

export default function CategoryPicker({ onSelect }: CategoryPickerProps) {
  return (
    <div>
      <h2 className=text-lg font-bold text-navy mb-1>Que necesitas hacer?</h2>
      <p className=text-sm text-gray-text mb-6>Selecciona una categoria para comenzar</p>
      <div className=grid grid-cols-1 sm:grid-cols-2 gap-4>
        {CATEGORIAS.map((cat) => {
          const Icon = ICON_MAP[cat.icono] || FileSearch;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(cat)}
              className=flex items-start gap-4 p-5 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gold hover:shadow-md transition-all text-left
            >
              <div className=w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0>
                <Icon size={20} />
              </div>
              <div>
                <h3 className=font-semibold text-navy text-sm>{cat.nombre}</h3>
                <p className=text-xs text-gray-text mt-1>{cat.descripcion}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
