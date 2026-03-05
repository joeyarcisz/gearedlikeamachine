"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { GearPlayLogo } from "@/components/icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Login failed");
      }

      router.push("/admin/contacts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClasses =
    "w-full bg-black/60 border border-card-border text-white text-sm px-4 py-3 focus:outline-none focus:border-steel transition-colors placeholder:text-muted/50";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-muted mb-2 font-[family-name:var(--font-heading)]";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border border-card-border bg-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <GearPlayLogo className="w-8 h-8 text-steel" />
            <span className="font-[family-name:var(--font-heading)] text-[11px] font-bold tracking-[0.12em] uppercase text-white leading-tight">
              Geared Like<br />A Machine
            </span>
          </div>

          <p className="text-muted text-[10px] uppercase tracking-widest text-center mb-6 font-[family-name:var(--font-heading)]">
            Admin Access
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className={labelClasses}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="Enter admin password"
                autoFocus
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs uppercase tracking-widest font-[family-name:var(--font-heading)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-steel text-black px-4 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-steel/80 transition-colors disabled:opacity-50 font-[family-name:var(--font-heading)]"
            >
              {submitting ? "Authenticating..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
