"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) setMsg(error.message);
    else { setMsg("Password updated. Redirecting..."); setTimeout(() => router.push("/dashboard"), 1200); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Set new password</h1>
        <p className="mt-1 text-sm text-slate-400">Enter your new password below.</p>
        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="h-11 rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-slate-100 outline-none focus:border-blue-500" />
          <button type="submit" disabled={loading} className="h-11 rounded-xl bg-blue-600 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60">
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
        {msg && <p className="mt-4 text-sm text-slate-400">{msg}</p>}
      </div>
    </div>
  );
}
