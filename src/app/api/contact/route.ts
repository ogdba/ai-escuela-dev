import { NextResponse } from "next/server";
import {
  buildTicketId,
  persistContactSubmission,
  validateContactPayload,
  type ContactRecord,
} from "@/lib/contact";

// NOTE: In serverless production (e.g., Vercel), this local file is ephemeral.
// Use a durable datastore (DB/object storage/queue) before deploying to prod.

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const { data, errors } = validateContactPayload(payload);

  if (!data || errors) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const ticketId = buildTicketId();
  const record: ContactRecord = {
    ...data,
    ticketId,
    createdAt: new Date().toISOString(),
    userAgent: req.headers.get("user-agent") || "unknown",
  };

  try {
    await persistContactSubmission(record);
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la solicitud" }, { status: 500 });
  }

  return NextResponse.json({ ticketId }, { status: 201 });
}
