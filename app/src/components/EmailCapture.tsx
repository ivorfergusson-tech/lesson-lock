"use client";

import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      // TODO: wire to Supabase / email provider
      await new Promise((r) => setTimeout(r, 600));
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@pianostudio.com"
        className="h-12 flex-1 rounded-full border border-black/10 bg-white px-5 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:bg-zinc-900 dark:text-white"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-12 rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {status === "loading" ? "Saving..." : status === "done" ? "You're on the list!" : "Get early access"}
      </button>
      {status === "done" && (
        <p className="text-sm text-emerald-600 sm:col-span-2">Thanks — we'll be in touch.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600 sm:col-span-2">Something went wrong. Try again.</p>
      )}
    </form>
  );
}