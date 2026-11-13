"use client";

import { useState, type FormEvent } from "react";

type Status = { state: "idle" | "busy" | "ok" | "error"; message: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Lean footer subscription bar. Captures emails in the `newsletter_subscribers` table. */
export function FooterSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setStatus({ state: "error", message: "Please enter a valid email address." });
      return;
    }
    setStatus({ state: "busy", message: "" });
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "footer" })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setEmail("");
        setStatus({ state: "ok", message: data.alreadySubscribed ? "You are already subscribed." : "Thank you. You are on the list." });
        return;
      }
      setStatus({ state: "error", message: data.error || "Subscription is not available right now. Please try again later." });
    } catch {
      setStatus({ state: "error", message: "We could not reach the subscription service. Please try again." });
    }
  }

  return (
    <div className="footer-subscribe">
      <p className="footer-subscribe__label">Stone notes, occasionally</p>
      <form className="footer-subscribe__form" onSubmit={handleSubmit} noValidate>
        <label className="visually-hidden" htmlFor="footer-subscribe-email">Email address</label>
        <input
          id="footer-subscribe-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => { setEmail(event.target.value); if (status.state !== "idle") setStatus({ state: "idle", message: "" }); }}
          aria-invalid={status.state === "error"}
          aria-describedby="footer-subscribe-status"
          disabled={status.state === "busy"}
        />
        <button type="submit" disabled={status.state === "busy"}>
          {status.state === "busy" ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      <p className={`footer-subscribe__status ${status.state === "ok" ? "is-ok" : ""} ${status.state === "error" ? "is-error" : ""}`} id="footer-subscribe-status" role="status" aria-live="polite">
        {status.message}
      </p>
    </div>
  );
}
