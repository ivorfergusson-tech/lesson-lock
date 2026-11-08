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
      await new Promise((r) => setTimeout(r, 600));
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@pianostudio.com"
          className="h-12 flex-1 rounded-full border border-slate-700 bg-slate-900 px-5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "done"}
          className="h-12 rounded-full bg-blue-600 px-6 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
        >
          {status === "loading" ? "Saving..." : "Get early access"}
        </button>
      </div>
      {status === "done" && (
        <p className="text-sm text-emerald-400">Thanks — we'll be in touch.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
