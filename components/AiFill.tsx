"use client";

import { useState } from "react";
import type { AiFields } from "@/lib/ai/ai-fill";

type Props = {
  mode: "media" | "product";
  assetId?: string;
  imageUrl?: string | null;
  name?: string;
  description?: string;
  onFill: (fields: AiFields) => void;
};

/**
 * "Fill with AI" control. The assistant reads the uploaded image, checks
 * public reference material for the name when one is given, and fills the
 * form fields. The team always reviews before saving.
 */
export function AiFill({ mode, assetId, imageUrl, name, description, onFill }: Props) {
  const [hint, setHint] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [sources, setSources] = useState<string[]>([]);

  async function run() {
    setBusy(true);
    setStatus("");
    setSources([]);
    try {
      const response = await fetch("/api/admin/ai/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId, imageUrl, name, description, hint, mode })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "The assistant could not fill the details.");
      onFill(result.fields ?? {});
      setSources(result.sources ?? []);
      setStatus(result.note || "Details filled in. Review them before saving.");
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "The assistant could not fill the details.";
      if (/not configured/i.test(message)) setStatus(await unconfiguredDetail(message));
      else setStatus(message);
    } finally {
      setBusy(false);
    }
  }

  /** When the provider is not configured, ask the server what it actually
   *  sees so the team can tell a missing variable from a restart that is
   *  still pending. No secret values are returned. */
  async function unconfiguredDetail(message: string) {
    try {
      const response = await fetch("/api/admin/ai/status");
      if (!response.ok) return message;
      const state = await response.json();
      const parts = [
        state.apiKeyPresent ? "AI_API_KEY visible" : "AI_API_KEY missing",
        state.baseUrlIsDefault ? "AI_BASE_URL not set (default OpenAI)" : `AI_BASE_URL visible (${state.baseUrl})`,
        state.modelIsDefault ? "AI_MODEL not set (default gpt-4o-mini)" : `AI_MODEL visible (${state.model})`
      ];
      return `${message} This server currently reports: ${parts.join(" · ")}. If the variables are already saved in the hosting panel, restart the application so the running process picks them up.`;
    } catch {
      return message;
    }
  }

  return (
    <div className="ai-fill">
      <div className="ai-fill__row">
        <input
          value={hint}
          onChange={(event) => setHint(event.target.value)}
          placeholder="Name or one-line description (optional)"
          maxLength={300}
          aria-label="Name or description for the assistant"
        />
        <button type="button" className="button button-outline" onClick={run} disabled={busy}>
          {busy ? "Reading…" : "✦ Fill with AI"}
        </button>
      </div>
      {status && <p className="ai-fill__status">{status}</p>}
      {sources.length > 0 && <p className="ai-fill__sources">Reference checked: {sources.join(" · ")}</p>}
    </div>
  );
}
