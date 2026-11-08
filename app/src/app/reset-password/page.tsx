"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("IvorFergusson@gmail.com");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setLoading(false);
    setMsg(error ? error.message : "Check your email for a reset link.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-1 text-sm text-slate-400">We'll email you a reset link.</p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="h-11 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-slate-100 outline-none focus:border-blue-500" />
          <button type="submit" disabled={loading} className="h-11 rounded-xl bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60">
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
        {msg && <p className="mt-4 text-sm text-emerald-400">{msg}</p>}
        <p className="mt-4 text-center text-sm text-slate-400">
          <Link href="/login" className="font-medium text-blue-400">Back to log in</Link>
        </p>
      </div>
    </div>
  );
}
