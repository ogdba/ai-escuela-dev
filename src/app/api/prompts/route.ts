import { NextRequest, NextResponse } from "next/server";
import { getCfUser } from "@/lib/cf-auth";
import { getDb } from "@/lib/db";

export async function POST(request: NextRequest) {
  const user = await getCfUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const sql = getDb();
  const body = await request.json();
  const { categoria, tipo, campos_completados, prompt_generado, prompt_mejorado } = body;

  if (!categoria || !tipo || !prompt_generado) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO prompts_guardados (user_id, categoria, tipo, campos_completados, prompt_generado, prompt_mejorado, es_publico)
    VALUES (${user.id}::uuid, ${categoria}, ${tipo}, ${JSON.stringify(campos_completados)}::jsonb, ${prompt_generado}, ${prompt_mejorado}, false)
    RETURNING id
  `;

  return NextResponse.json({ id: rows[0].id });
}

export async function GET() {
  const user = await getCfUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const sql = getDb();
  const rows = await sql`
    SELECT id, categoria, tipo, prompt_generado, prompt_mejorado, es_publico, created_at
    FROM prompts_guardados WHERE user_id = ${user.id}::uuid ORDER BY created_at DESC
  `;

  return NextResponse.json(rows);
}

export async function PATCH(request: NextRequest) {
  const user = await getCfUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const sql = getDb();
  const body = await request.json();
  const { id, es_publico } = body;

  await sql`UPDATE prompts_guardados SET es_publico = ${es_publico} WHERE id = ${id}::uuid AND user_id = ${user.id}::uuid`;

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getCfUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const sql = getDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  await sql`DELETE FROM prompts_guardados WHERE id = ${id}::uuid AND user_id = ${user.id}::uuid`;

  return NextResponse.json({ ok: true });
}
