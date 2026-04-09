import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function getDb() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL not configured");
    _sql = neon(url);
  }
  return _sql;
}

export async function getOrCreateUser(email: string) {
  const sql = getDb();
  const existing = await sql`SELECT id, email, name FROM users WHERE email = ${email}`;
  if (existing.length > 0) return existing[0];

  const created = await sql`
    INSERT INTO users (email, name) VALUES (${email}, ${email.split("@")[0]})
    RETURNING id, email, name
  `;
  return created[0];
}
