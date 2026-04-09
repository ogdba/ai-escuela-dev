import { NextRequest, NextResponse } from "next/server";
import { getCfUser } from "@/lib/cf-auth";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const user = await getCfUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const sql = getDb();
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");

  let rows;
  if (categoria && categoria !== "todos") {
    rows = await sql`
      SELECT id, categoria, tipo, prompt_generado, prompt_mejorado, es_publico, created_at
      FROM prompts_guardados WHERE es_publico = true AND categoria = ${categoria} ORDER BY created_at DESC
    `;
  } else {
    rows = await sql`
      SELECT id, categoria, tipo, prompt_generado, prompt_mejorado, es_publico, created_at
      FROM prompts_guardados WHERE es_publico = true ORDER BY created_at DESC
    `;
  }

  return NextResponse.json(rows);
}
