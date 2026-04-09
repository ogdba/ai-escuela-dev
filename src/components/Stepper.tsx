use client;

import { Check } from lucide-react;

const STEPS = [Categoria, Tipo, Datos, Prompt];

interface StepperProps {
  currentStep: number;
}

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className=flex items-center justify-center gap-2 mb-8>
      {STEPS.map((label, i) => {
        const step = i + 1;
        const completed = step < currentStep;
        const active = step === currentStep;

        return (
          <div key={label} className=flex items-center gap-2>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                completed
                  ? "bg-green text-white"
                  : active
                    ? "bg-gold text-navy-deep"
                    : "bg-white border border-gray-300 text-gray-text"
              }`}
            >
              {completed ? <Check size={14} /> : step}
            </div>
            <span
              className={`text-xs font-medium hidden sm:inline ${
                active ? "text-navy" : "text-gray-text"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 ${
                  completed ? "bg-green" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
