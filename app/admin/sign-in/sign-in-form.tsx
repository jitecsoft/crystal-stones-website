"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function SignInForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const search = useSearchParams();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) });
      if (authError) throw authError;
      const next = search.get("next");
      window.location.assign(next?.startsWith("/admin") && !next.startsWith("//") ? next : "/admin");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Sign in could not be completed."); setBusy(false); }
  }
  return <form className="admin-form" onSubmit={submit}><label>Email<input type="email" name="email" autoComplete="username" required /></label><label>Password<input type="password" name="password" autoComplete="current-password" required /></label>{error && <p className="admin-error" role="alert">{error}</p>}<button className="button button-dark" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button><p className="admin-help">Team accounts are invitation-only. There is no public sign-up.</p></form>;
}
