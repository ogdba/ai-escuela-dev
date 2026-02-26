import { describe, expect, it } from "vitest";
import { validateContactForm, hasErrors } from "@/lib/validators";

describe("validateContactForm", () => {
  it("returns errors when fields are empty", () => {
    const errors = validateContactForm({ name: "", email: "", message: "" });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(hasErrors(errors)).toBe(true);
  });

  it("validates minimal length on name and message", () => {
    const errors = validateContactForm({ name: "A", email: "ada@example.com", message: "short" });
    expect(errors.name).toContain("al menos 2");
    expect(errors.message).toContain("al menos 10");
  });

  it("detects invalid email", () => {
    const errors = validateContactForm({ name: "Ada", email: "nope@", message: "" });
    expect(errors.email).toContain("correo válido");
  });

  it("passes with valid data", () => {
    const errors = validateContactForm({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "mensaje válido de contacto",
    });
    expect(hasErrors(errors)).toBe(false);
  });
});
