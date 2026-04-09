import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateJSON } from "@/lib/generate";
import { TIPS_SYSTEM } from "@/content/cron-prompts";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const data = await generateJSON<{ titulo: string; contenido: string }[]>(
    TIPS_SYSTEM,
    "Genera 3 tips nuevos para esta semana sobre uso de IA en el Poder Judicial."
  );

  const sql = getDb();
  for (const tip of data) {
    await sql`INSERT INTO tips (titulo, contenido) VALUES (${tip.titulo}, ${tip.contenido})`;
  }

  return NextResponse.json({ message: "Tips generados", count: data.length });
}
