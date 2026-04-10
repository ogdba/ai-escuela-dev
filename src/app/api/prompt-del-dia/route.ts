import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const sql = getDb();
  const rows = await sql`
    SELECT id, titulo, categoria, prompt_texto, ejemplo_uso, fecha
    FROM prompt_del_dia ORDER BY fecha DESC LIMIT 1
  `;

  if (rows.length === 0) {
    return NextResponse.json(null);
  }

  return NextResponse.json(rows[0]);
}
