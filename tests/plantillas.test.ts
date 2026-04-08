import { describe, it, expect } from "vitest";
import { PLANTILLAS, CATEGORIAS } from "@/content/plantillas";

describe("plantillas data integrity", () => {
  it("all plantillas reference valid categories", () => {
    const catIds = CATEGORIAS.map((c) => c.id);
    for (const p of PLANTILLAS) {
      expect(catIds).toContain(p.categoria);
    }
  });

  it("all plantillas have unique ids", () => {
    const ids = PLANTILLAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all categories have at least one plantilla", () => {
    for (const cat of CATEGORIAS) {
      const count = PLANTILLAS.filter((p) => p.categoria === cat.id).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it("required fields have non-empty placeholders", () => {
    for (const p of PLANTILLAS) {
      for (const campo of p.campos) {
        if (campo.requerido && campo.tipo !== "select") {
          expect(campo.placeholder.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("select fields have opciones defined", () => {
    for (const p of PLANTILLAS) {
      for (const campo of p.campos) {
        if (campo.tipo === "select") {
          expect(campo.opciones).toBeDefined();
          expect(campo.opciones!.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
