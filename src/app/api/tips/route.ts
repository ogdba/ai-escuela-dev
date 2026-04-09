import { NextResponse } from "next/server";
import { getCfUser } from "@/lib/cf-auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const user = await getCfUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const sql = getDb();
  const rows = await sql`
    SELECT id, titulo, contenido, created_at
    FROM tips ORDER BY created_at DESC LIMIT 20
  `;

  return NextResponse.json(rows);
}
