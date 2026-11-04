import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/supabase/config";

export async function getMediaMember() {
  if (!hasSupabaseConfig()) return null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (typeof userId !== "string") return null;
  const { data: member } = await supabase.from("media_team_members").select("role,active").eq("user_id", userId).maybeSingle();
  if (!member?.active) return null;
  return { supabase, userId, role: member.role as string };
}

export async function requireMediaMember() {
  const member = await getMediaMember();
  if (!member) redirect(hasSupabaseConfig() ? "/admin/sign-in" : "/admin/setup");
  return member;
}
