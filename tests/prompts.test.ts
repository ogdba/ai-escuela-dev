import { describe, it, expect } from "vitest";
import { renderTemplate } from "@/lib/prompts";

describe("renderTemplate", () => {
  it("replaces simple placeholders", () => {
    const template = "Hola {{nombre}}, tu cargo es {{cargo}}.";
    const result = renderTemplate(template, { nombre: "Juan", cargo: "Director" });
    expect(result).toBe("Hola Juan, tu cargo es Director.");
  });

  it("handles conditional blocks when field has value", () => {
    const template = "Base.{{#extra}} Extra: {{extra}}{{/extra}}";
    const result = renderTemplate(template, { extra: "info" });
    expect(result).toBe("Base. Extra: info");
  });

  it("removes conditional blocks when field is empty", () => {
    const template = "Base.{{#extra}} Extra: {{extra}}{{/extra}}";
    const result = renderTemplate(template, { extra: "" });
    expect(result).toBe("Base.");
  });

  it("removes conditional blocks when field is missing", () => {
    const template = "Base.{{#extra}} Extra: {{extra}}{{/extra}}";
    const result = renderTemplate(template, {});
    expect(result).toBe("Base.");
  });

  it("handles multiple fields and conditionals", () => {
    const template = "Oficio {{numero}} para {{destinatario}}.{{#monto}} Monto: ${{monto}}{{/monto}}";
    const result = renderTemplate(template, { numero: "DA/001/2026", destinatario: "Juan", monto: "50000" });
    expect(result).toBe("Oficio DA/001/2026 para Juan. Monto: $50000");
  });

  it("leaves unknown placeholders untouched", () => {
    const template = "Hola {{nombre}}, {{desconocido}}.";
    const result = renderTemplate(template, { nombre: "Juan" });
    expect(result).toBe("Hola Juan, {{desconocido}}.");
  });
});
