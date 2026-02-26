import { describe, expect, it } from "vitest";
import { validateContactForm, hasErrors } from "@/lib/validators";

describe("validateContactForm", () => {
  it("returns errors when fields are empty", () => {
    const errors = validateContactForm({ name: "", email: "", message: "" });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(hasErrors(errors)).toBe(true);
  });

  it("detects invalid email", () => {
    const errors = validateContactForm({ name: "Ada", email: "nope@", message: "" });
    expect(errors.email).toContain("correo válido");
  });

  it("passes with valid data", () => {
    const errors = validateContactForm({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "hola",
    });
    expect(hasErrors(errors)).toBe(false);
  });
});
