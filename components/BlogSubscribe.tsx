"use client";

import { useState } from "react";

export default function BlogSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/blog/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-card-border bg-card p-8 text-center">
        <p className="text-steel text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-heading)] font-semibold">
          You are in.
        </p>
        <p className="text-muted text-sm mt-2">
          New posts land in your inbox. No spam.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-card-border bg-card p-8">
      <p className="text-steel text-xs uppercase tracking-[0.3em] mb-2 font-[family-name:var(--font-heading)] font-semibold">
        Stay sharp
      </p>
      <p className="text-muted text-sm mb-6">
        New posts on cinematography, production, and pricing. No spam.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 bg-black border border-card-border px-4 py-3 text-sm text-white placeholder:text-muted focus:border-steel focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-white text-black px-6 py-3 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)] font-bold hover:bg-steel transition-colors disabled:opacity-50"
        >
          {status === "sending" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-400 text-xs mt-3">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
