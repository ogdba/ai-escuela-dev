import { describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { buildTicketId, persistContactSubmission, validateContactPayload } from "@/lib/contact";

const tmpDir = path.join(process.cwd(), "tmp-tests");
const tmpFile = path.join(tmpDir, "contact.jsonl");

describe("contact utils", () => {
  it("normalizes and validates payload", () => {
    const { data, errors } = validateContactPayload({
      name: "  Ada  ",
      email: "ada@example.com ",
      message: " Hola desde vitest ",
    });

    expect(errors).toBeUndefined();
    expect(data).toEqual({
      name: "Ada",
      email: "ada@example.com",
      message: "Hola desde vitest",
    });
  });

  it("rejects invalid payloads", () => {
    const { errors } = validateContactPayload({ name: "", email: "bad", message: "hi" });
    expect(errors).toBeDefined();
  });

  it("builds ticket ids with prefix", () => {
    const id = buildTicketId("12345678-abcd");
    expect(id).toMatch(/^TCK-12345678/i);
  });

  it("persists contact submissions to jsonl", async () => {
    const record = {
      ticketId: "TCK-TEST123",
      name: "Test User",
      email: "test@example.com",
      message: "Mensaje de prueba",
      createdAt: new Date().toISOString(),
      userAgent: "vitest",
    };

    await fs.mkdir(tmpDir, { recursive: true });
    await persistContactSubmission(record, tmpFile);
    const saved = await fs.readFile(tmpFile, "utf-8");
    expect(saved.trim()).toContain("TCK-TEST123");
  });
});

// Cleanup created files after tests
afterAll(async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
});
