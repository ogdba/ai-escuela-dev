import { promises as fs } from "node:fs";
import path from "node:path";
import { validateContactForm, type ContactFormData } from "@/lib/validators";

export interface ContactRecord extends ContactFormData {
  ticketId: string;
  createdAt: string;
  userAgent?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
export const CONTACT_FILE = path.join(DATA_DIR, "contact-submissions.jsonl");

export function buildTicketId(seed: string = crypto.randomUUID()): string {
  return `TCK-${seed.slice(0, 8).toUpperCase()}`;
}

export function normalizeContactInput(data: ContactFormData): ContactFormData {
  return {
    name: data.name.trim(),
    email: data.email.trim(),
    message: data.message.trim(),
  };
}

export async function persistContactSubmission(
  record: ContactRecord,
  filePath: string = CONTACT_FILE,
) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.appendFile(filePath, `${JSON.stringify(record)}\n`, { encoding: "utf-8" });
}

export function validateContactPayload(payload: unknown): {
  data?: ContactFormData;
  errors?: Record<string, string>;
} {
  if (!payload || typeof payload !== "object") {
    return { errors: { form: "Formato de datos inválido" } };
  }

  const { name = "", email = "", message = "" } = payload as Record<string, string>;
  const data = normalizeContactInput({ name, email, message });
  const errors = validateContactForm(data);

  if (Object.keys(errors).length > 0) {
    return { errors: errors as Record<string, string> };
  }

  return { data };
}
