import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { generateJSON } from "@/lib/generate";
import { PROMPT_DEL_DIA_SYSTEM } from "@/content/cron-prompts";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Monterrey" });

  const sql = getDb();

  const existing = await sql`SELECT id FROM prompt_del_dia WHERE fecha = ${hoy}::date`;
  if (existing.length > 0) {
    return NextResponse.json({ message: "Ya existe prompt para hoy" });
  }

  const categorias = ["analizar", "generar", "datos", "comunicar", "presentaciones"];
  const data = await generateJSON<{
    titulo: string;
    categoria: string;
    que_hace: string;
    prompt_texto: string;
    que_obtendras: string;
    ejemplo_uso: string;
  }>(PROMPT_DEL_DIA_SYSTEM, `Genera el prompt del dia para ${hoy}. Categoria sugerida: ${categorias[Math.floor(Math.random() * 5)]}`);

  await sql`
    INSERT INTO prompt_del_dia (titulo, categoria, que_hace, prompt_texto, que_obtendras, ejemplo_uso, fecha)
    VALUES (${data.titulo}, ${data.categoria}, ${data.que_hace}, ${data.prompt_texto}, ${data.que_obtendras}, ${data.ejemplo_uso}, ${hoy}::date)
  `;

  return NextResponse.json({ message: "Prompt generado", data });
}
