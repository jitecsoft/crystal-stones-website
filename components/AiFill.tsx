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
      setStatus(cause instanceof Error ? cause.message : "The assistant could not fill the details.");
    } finally {
      setBusy(false);
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
