import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);

async function resolveUserId(authHeader: string): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  try {
    const res = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/auth/v1/user`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: authHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    return data.id ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  if (!hasSupabase) {
    return NextResponse.json({ entries: [], mode: "local" });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = await resolveUserId(authHeader);
  if (!userId) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  try {
    const url = `${SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/user_progress?user_id=eq.${userId}&order=updated_at.desc`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_SERVICE_KEY!,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      cache: "no-store",
    });
    const entries = await res.json();
    return NextResponse.json({ entries, mode: "supabase" });
  } catch {
    return NextResponse.json({ entries: [], mode: "local" });
  }
}

export async function POST(request: NextRequest) {
  if (!hasSupabase) {
    return NextResponse.json({ ok: true, mode: "local" });
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userId = await resolveUserId(authHeader);
  if (!userId) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      contentType?: string;
      contentId?: string;
      percent?: number;
    };
    const { contentType, contentId, percent } = body;

    if (!contentType || !contentId || percent == null) {
      return NextResponse.json(
        { error: "Campos requeridos: contentType, contentId, percent" },
        { status: 400 },
      );
    }

    const restUrl = `${SUPABASE_URL!.replace(/\/$/, "")}/rest/v1/user_progress`;
    await fetch(restUrl, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY!,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        user_id: userId,
        content_type: contentType,
        content_id: contentId,
        percent,
        completed_at: percent >= 100 ? new Date().toISOString() : null,
      }),
    });

    return NextResponse.json({ ok: true, mode: "supabase" });
  } catch {
    return NextResponse.json({ ok: true, mode: "local" });
  }
}
