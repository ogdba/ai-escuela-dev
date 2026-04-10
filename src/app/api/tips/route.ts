import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const sql = getDb();
  const rows = await sql`
    SELECT id, titulo, contenido, created_at
    FROM tips ORDER BY created_at DESC LIMIT 20
  `;

  return NextResponse.json(rows);
}
