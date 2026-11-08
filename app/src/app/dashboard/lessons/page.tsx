"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Header from "@/components/Header";

export default function LessonsPage() {
  const supabase = createClient();
  const [lessons, setLessons] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [form, setForm] = useState({ student_name: "", student_email: "", scheduled_at: "", rate: "45", policy_id: "" });
  const [msg, setMsg] = useState("");

  async function load() {
    const { data: l } = await supabase.from("lessons").select("*").order("scheduled_at", { ascending: false });
    setLessons(l ?? []);
    const { data: p } = await supabase.from("policies").select("*");
    setPolicies(p ?? []);
  }
  useEffect(() => { load(); }, []);

  async function addLesson(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("lessons").insert({
      tutor_id: user.id,
      policy_id: form.policy_id || null,
      student_name: form.student_name,
      student_email: form.student_email,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
      rate_cents: Math.round(Number(form.rate) * 100),
    });
    if (error) setMsg(error.message); else { setMsg("Added"); setForm({ student_name: "", student_email: "", scheduled_at: "", rate: "45", policy_id: "" }); load(); }
  }

  async function mark(id: string, status: string) {
    await supabase.from("lessons").update({ status }).eq("id", id);
    load();
  }

  async function importCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split(/\r?\n/);
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const rows = lines.slice(1).map((line) => {
      const cols = line.split(",");
      const get = (k: string) => cols[header.indexOf(k)]?.trim();
      return {
        tutor_id: user.id,
        student_name: get("student_name") || get("name"),
        student_email: get("student_email") || get("email"),
        scheduled_at: new Date(get("scheduled_at") || get("date")).toISOString(),
        rate_cents: Math.round(Number(get("rate") || get("rate_cents") || "45") * 100),
        policy_id: form.policy_id || null,
      };
    });
    const { error } = await supabase.from("lessons").insert(rows);
    if (error) setMsg(error.message); else { setMsg(`Imported ${rows.length} lessons`); load(); }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Lessons</h1>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-slate-100">← Dashboard</Link>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="font-semibold">Add lesson</h2>
          <form onSubmit={addLesson} className="mt-3 grid gap-3 sm:grid-cols-6">
            <input placeholder="Student name" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} className="h-10 rounded-lg border border-slate-700 px-3 text-sm bg-slate-800 text-slate-100" required />
            <input placeholder="Email" value={form.student_email} onChange={(e) => setForm({ ...form, student_email: e.target.value })} className="h-10 rounded-lg border border-slate-700 px-3 text-sm bg-slate-800 text-slate-100" />
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Date</label>
              <input type="date" value={form.scheduled_at.split("T")[0]} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value + "T" + (form.scheduled_at.split("T")[1] || "09:00") })} className="h-10 rounded-lg border border-slate-700 px-3 text-sm bg-slate-800 text-slate-100" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Time</label>
              <input type="time" value={form.scheduled_at.split("T")[1] || "09:00"} onChange={(e) => setForm({ ...form, scheduled_at: (form.scheduled_at.split("T")[0] || new Date().toISOString().slice(0,10)) + "T" + e.target.value })} className="h-10 rounded-lg border border-slate-700 px-3 text-sm bg-slate-800 text-slate-100" required />
            </div>
            <input placeholder="Rate $" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} className="h-10 rounded-lg border border-slate-700 px-3 text-sm bg-slate-800 text-slate-100" />
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500">Add</button>
          </form>
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm font-medium">CSV import (student_name,student_email,scheduled_at,rate):</label>
            <input type="file" accept=".csv" onChange={importCsv} className="text-sm" />
          </div>
          {msg && <p className="mt-3 text-sm text-slate-400">{msg}</p>}
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-800 text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Student</th>
                <th className="px-4 py-3 text-left font-medium">Scheduled</th>
                <th className="px-4 py-3 text-left font-medium">Rate</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((l) => (
                <tr key={l.id} className="border-b border-black/5 dark:border-white/10">
                  <td className="px-4 py-3">{l.student_name}<br /><span className="text-xs text-slate-400">{l.student_email}</span></td>
                  <td className="px-4 py-3">{new Date(l.scheduled_at).toLocaleString()}</td>
                  <td className="px-4 py-3">${(l.rate_cents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3">{l.status}</td>
                  <td className="px-4 py-3 space-x-2">
                    {l.status === "scheduled" && (
                      <>
                        <button onClick={() => mark(l.id, "no_show")} className="text-xs text-red-600 hover:underline">No-show</button>
                        <button onClick={() => mark(l.id, "late_cancel")} className="text-xs text-amber-600 hover:underline">Late cancel</button>
                        <button onClick={() => mark(l.id, "completed")} className="text-xs text-emerald-600 hover:underline">Completed</button>
                      </>
                    )}
                    {l.status === "no_show" || l.status === "late_cancel" ? (
                      <>
                        <button onClick={async () => { const r = await fetch("/api/charge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId: l.id }) }); const d = await r.json(); if (d.ok) { alert(`Charged $${(d.amount/100).toFixed(2)}`); load(); } else alert(d.error); }} className="text-xs text-indigo-600 hover:underline">Charge kept fee</button>
                        <button onClick={() => mark(l.id, "completed")} className="text-xs text-emerald-600 hover:underline">Forgive</button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
              {lessons.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">No lessons yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
