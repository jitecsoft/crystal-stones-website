import { hasSupabaseConfig } from "@/lib/supabase/config";
import { SignInForm } from "./sign-in-form";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = { title: "Team sign in | Crystal Stones" };
export const dynamic = "force-dynamic";

export default function AdminSignInPage() {
  if (!hasSupabaseConfig()) return <main className="admin-shell"><section className="admin-card"><p className="eyebrow">Media library</p><h1>Team sign in</h1><p>Team access is not configured yet. Add the dedicated Crystal Stones Supabase project URL and publishable key to local environment settings, apply the reviewed migration, and invite team members.</p><Link className="button button-dark" href="/">Return to website</Link></section></main>;
  return <main className="admin-shell"><section className="admin-card"><p className="eyebrow">Crystal Stones · Team workspace</p><h1>Sign in</h1><p>Use your invited team account to manage media.</p><Suspense fallback={<p>Loading sign-in…</p>}><SignInForm /></Suspense></section></main>;
}
