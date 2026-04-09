"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar";
import Stepper from "@/components/Stepper";
import CategoryPicker from "@/components/CategoryPicker";
import TypePicker from "@/components/TypePicker";
import PromptForm from "@/components/PromptForm";
import PromptPreview from "@/components/PromptPreview";
import { renderTemplate } from "@/lib/prompts";
import type { Categoria, Plantilla } from "@/content/plantillas";

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [plantilla, setPlantilla] = useState<Plantilla | null>(null);
  const [campos, setCampos] = useState<Record<string, string>>({});
  const [promptGenerado, setPromptGenerado] = useState("");

  const handleCategorySelect = (cat: Categoria) => {
    setCategoria(cat);
    setStep(2);
  };

  const handleTypeSelect = (p: Plantilla) => {
    setPlantilla(p);
    setStep(3);
  };

  const handleFormSubmit = (values: Record<string, string>) => {
    setCampos(values);
    setPromptGenerado(renderTemplate(plantilla!.plantilla, values));
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setCategoria(null);
    setPlantilla(null);
    setCampos({});
    setPromptGenerado("");
  };

  return (
    <AuthGuard>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Stepper currentStep={step} />
        {step === 1 && <CategoryPicker onSelect={handleCategorySelect} />}
        {step === 2 && categoria && (
          <TypePicker categoria={categoria} onSelect={handleTypeSelect} onBack={() => setStep(1)} />
        )}
        {step === 3 && plantilla && (
          <PromptForm plantilla={plantilla} onSubmit={handleFormSubmit} onBack={() => setStep(2)} />
        )}
        {step === 4 && plantilla && (
          <PromptPreview
            plantilla={plantilla}
            promptGenerado={promptGenerado}
            campos={campos}
            onBack={() => setStep(3)}
            onReset={handleReset}
          />
        )}
      </main>
    </AuthGuard>
  );
}
