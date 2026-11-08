"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Header from "@/components/Header";

const TEMPLATES = [
  { key: "24h-50", name: "24h / 50% kept", hours: 24, pct: 50 },
  { key: "48h-100", name: "48h / 100% kept", hours: 48, pct: 100 },
  { key: "12h-50", name: "12h / 50% kept", hours: 12, pct: 50 },
  { key: "24h-100", name: "24h / 100% kept", hours: 24, pct: 100 },
];

export default function PolicyPage() {
  const supabase = createClient();
  const [name, setName] = useState("My policy");
  const [hours, setHours] = useState(24);
  const [pct, setPct] = useState(50);
  const [policies, setPolicies] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function load() {
    const { data } = await supabase.from("policies").select("*").order("created_at", { ascending: false });
    setPolicies(data ?? []);
  }
  useEffect(() => { load(); }, []);

  function applyTpl(t: typeof TEMPLATES[0]) {
    setHours(t.hours);
    setPct(t.pct);
    setName(t.name);
  }

  async function save() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setMsg("Not signed in"); setSaving(false); return; }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.random().toString(36).slice(2, 7);
    const { error } = await supabase.from("policies").insert({
      tutor_id: user.id, name, template_key: null, cancel_window_hours: hours, kept_fee_percent: pct, slug,
    });
    setSaving(false);
    if (error) setMsg(error.message); else { setMsg("Saved"); load(); }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Policy builder</h1>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-100">← Dashboard</Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold">Templates</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {TEMPLATES.map((t) => (
              <button key={t.key} onClick={() => applyTpl(t)} className="rounded-full border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800">
                {t.name}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium">Policy name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10 bg-slate-800 text-slate-100" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Cancel window (hours)</span>
              <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10 bg-slate-800 text-slate-100" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Kept fee %</span>
              <input type="number" value={pct} onChange={(e) => setPct(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10 bg-slate-800 text-slate-100" />
            </label>
          </div>

          <button onClick={save} disabled={saving} className="mt-6 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-50">
            {saving ? "Saving…" : "Save policy"}
          </button>
          {msg && <p className="mt-3 text-sm text-slate-400">{msg}</p>}
        </div>

        <div className="mt-8">
          <h2 className="font-semibold">Your policies</h2>
          <ul className="mt-3 space-y-2">
            {policies.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm">
                <span>{p.name}</span>
                <span className="text-slate-400">{p.cancel_window_hours}h / {p.kept_fee_percent}% kept · slug: {p.slug}</span>
              </li>
            ))}
            {policies.length === 0 && <li className="text-sm text-slate-400">No policies yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
