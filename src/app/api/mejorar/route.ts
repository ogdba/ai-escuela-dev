import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { mejorarPrompt } from "@/lib/openrouter";
import { SYSTEM_PROMPT_BASE, SYSTEM_PROMPT_PRESENTACIONES } from "@/content/system-prompts";

const LIMITE_DIARIO = parseInt(process.env.MEJORA_LIMITE_DIARIO || "20", 10);

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token = authHeader.slice(7);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { prompt, categoria } = body as { prompt: string; categoria: string };

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt requerido" }, { status: 400 });
  }

  // Check daily usage
  const hoy = new Date().toLocaleDateString("en-CA", { timeZone: "America/Monterrey" });
  const { data: uso } = await supabase
    .from("uso_ia")
    .select("cantidad_usos")
    .eq("user_id", user.id)
    .eq("fecha", hoy)
    .single();

  const usosHoy = uso?.cantidad_usos ?? 0;
  if (usosHoy >= LIMITE_DIARIO) {
    return NextResponse.json(
      { error: "Limite diario alcanzado", restantes: 0 },
      { status: 429 },
    );
  }

  // Build system prompt
  let systemPrompt = SYSTEM_PROMPT_BASE;
  if (categoria === "presentaciones") {
    systemPrompt += SYSTEM_PROMPT_PRESENTACIONES;
  }

  try {
    const mejorado = await mejorarPrompt(prompt, systemPrompt);

    // Increment usage
    if (uso) {
      await supabase
        .from("uso_ia")
        .update({ cantidad_usos: usosHoy + 1 })
        .eq("user_id", user.id)
        .eq("fecha", hoy);
    } else {
      await supabase
        .from("uso_ia")
        .insert({ user_id: user.id, fecha: hoy, cantidad_usos: 1 });
    }

    return NextResponse.json({
      mejorado,
      restantes: LIMITE_DIARIO - usosHoy - 1,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
