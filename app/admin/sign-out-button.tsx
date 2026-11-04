"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.assign("/admin/sign-in");
  }
  return <button className="text-button" onClick={signOut}>Sign out</button>;
}
