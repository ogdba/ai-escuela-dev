import { NextResponse } from "next/server";
import { getCfUser } from "@/lib/cf-auth";

export async function GET() {
  const user = await getCfUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return NextResponse.json(user);
}
