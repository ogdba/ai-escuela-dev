import { headers } from "next/headers";
import { getOrCreateUser } from "@/lib/db";

export async function getCfUser() {
  const headersList = await headers();
  const email = headersList.get("cf-access-authenticated-user-email");
  if (!email) return null;
  return getOrCreateUser(email);
}
