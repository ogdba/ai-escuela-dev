import { NextRequest, NextResponse } from "next/server";
import { getCfUser } from "@/lib/cf-auth";
import { getDb } from "@/lib/db";
import { mejorarPrompt } from "@/lib/openrouter";
import { SYSTEM_PROMPT_BASE, SYSTEM_PROMPT_PRESENTACIONES } from "@/content/system-prompts";

const LIMITE_DIARIO = parseInt(process.env.MEJORA_LIMITE_DIARIO || "20", 10);

export async function POST(request: NextRequest) {
  const user = await getCfUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { prompt, categoria } = body as { prompt: string; categoria: string };

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt requerido" }, { status: 400 });
  }

  const sql = getDb();
  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Monterrey" });
  const usoRows = await sql`
    SELECT cantidad_usos FROM uso_ia WHERE user_id = ${user.id}::uuid AND fecha = ${hoy}::date
  `;

  const usosHoy = usoRows[0]?.cantidad_usos ?? 0;
  if (usosHoy >= LIMITE_DIARIO) {
    return NextResponse.json({ error: "Limite diario alcanzado", restantes: 0 }, { status: 429 });
  }

  let systemPrompt = SYSTEM_PROMPT_BASE;
  if (categoria === "presentaciones") {
    systemPrompt += SYSTEM_PROMPT_PRESENTACIONES;
  }

  try {
    const mejorado = await mejorarPrompt(prompt, systemPrompt);

    if (usoRows.length > 0) {
      await sql`UPDATE uso_ia SET cantidad_usos = ${usosHoy + 1} WHERE user_id = ${user.id}::uuid AND fecha = ${hoy}::date`;
    } else {
      await sql`INSERT INTO uso_ia (user_id, fecha, cantidad_usos) VALUES (${user.id}::uuid, ${hoy}::date, 1)`;
    }

    return NextResponse.json({ mejorado, restantes: LIMITE_DIARIO - usosHoy - 1 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
