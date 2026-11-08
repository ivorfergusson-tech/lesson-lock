import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const sp = await searchParams;
  const demo = sp?.demo === "1";

  if (demo) {
    const { DEMO_LESSONS, DEMO_TOTAL_PROTECTED } = await import("@/lib/demo");
    const charged = DEMO_LESSONS.filter((l: any) => l.status === "charged");
    const noShows = DEMO_LESSONS.filter((l: any) => l.status === "no_show" || l.status === "late_cancel").length;
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <Header />
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <div className="flex gap-3">
              <Link href="/dashboard/policy" className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-sm font-medium transition">Policy builder →</Link>
              <Link href="/dashboard/lessons" className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-sm font-medium transition">Lessons →</Link>
            </div>
          </div>
          <p className="mt-3 text-slate-400 text-base">You've recovered <span className="text-emerald-400 font-medium">${(DEMO_TOTAL_PROTECTED / 100).toFixed(2)}</span> from {charged.length} kept-fee charges.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-400">Protected revenue</p><p className="mt-2 text-2xl font-semibold text-emerald-400">${(DEMO_TOTAL_PROTECTED / 100).toFixed(2)}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-400">Kept-fee charges</p><p className="mt-2 text-2xl font-semibold">{charged.length}</p></div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-400">Pending</p><p className="mt-2 text-2xl font-semibold">{noShows}</p></div>
          </div>
          <div className="mt-12">
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Recent kept-fee charges</h2>
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-800 text-slate-400"><tr><th className="px-4 py-3 text-left font-medium">Student</th><th className="px-4 py-3 text-left font-medium">Scheduled</th><th className="px-4 py-3 text-left font-medium">Charged</th><th className="px-4 py-3 text-left font-medium">Charge ID</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {charged.map((l: any) => (
                    <tr key={l.id}><td className="px-4 py-3">{l.student_name}</td><td className="px-4 py-3 text-slate-400">{new Date(l.scheduled_at).toLocaleString()}</td><td className="px-4 py-3">${((l.charged_cents ?? 0) / 100).toFixed(2)}</td><td className="px-4 py-3 font-mono text-xs text-slate-500">{l.charge_id}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tutor } = await supabase.from("tutors").select("stripe_account_id, stripe_onboarded").eq("id", user.id).single();
  const { data: policies } = await supabase.from("policies").select("id").eq("tutor_id", user.id);
  const { data: bookings } = await supabase.from("protected_bookings").select("id").eq("tutor_id", user.id);
  const { data: lessons } = await supabase.from("lessons").select("*").eq("tutor_id", user.id);
  const charged = (lessons ?? []).filter((l: any) => l.status === "charged");
  const totalProtected = charged.reduce((sum: number, l: any) => sum + (l.charged_cents ?? 0), 0);
  const noShows = (lessons ?? []).filter((l: any) => l.status === "no_show" || l.status === "late_cancel").length;
  const initials = (user.email ?? "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <Header initials={initials} />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <div className="flex gap-3">
            <Link href="/dashboard/policy" className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-sm font-medium transition">Policy builder →</Link>
            <Link href="/dashboard/lessons" className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-sm font-medium transition">Lessons →</Link>
          </div>
        </div>
        <p className="mt-3 text-slate-400 text-base">You've recovered <span className="text-emerald-400 font-medium">${(totalProtected / 100).toFixed(2)}</span> from {charged.length} kept-fee charges.</p>
        {!(policies?.length && tutor?.stripe_account_id && bookings?.length) && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="font-semibold">Get started — 3 steps to your first protected booking</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3"><span className={(policies ?? []).length > 0 ? "text-emerald-400" : "text-slate-500"}>{(policies ?? []).length > 0 ? "✓" : "○"}</span><span className={(policies ?? []).length > 0 ? "line-through text-slate-500" : ""}>1. Create a policy</span>{!((policies ?? []).length > 0) && <Link href="/dashboard/policy" className="ml-auto text-sm text-blue-400 hover:underline">Go →</Link>}</li>
              <li className="flex items-center gap-3"><span className={tutor?.stripe_account_id ? "text-emerald-400" : "text-slate-500"}>{tutor?.stripe_account_id ? "✓" : "○"}</span><span className={tutor?.stripe_account_id ? "line-through text-slate-500" : ""}>2. Connect Stripe</span>{!tutor?.stripe_account_id && <a href="/api/stripe/connect" className="ml-auto text-sm text-blue-400 hover:underline">Connect →</a>}</li>
              <li className="flex items-center gap-3"><span className={(bookings ?? []).length > 0 ? "text-emerald-400" : "text-slate-500"}>{(bookings ?? []).length > 0 ? "✓" : "○"}</span><span className={(bookings ?? []).length > 0 ? "line-through text-slate-500" : ""}>3. Get a student to save a card on file</span></li>
            </ul>
          </div>
        )}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-400">Protected revenue</p><p className="mt-2 text-2xl font-semibold text-emerald-400">${(totalProtected / 100).toFixed(2)}</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-400">Kept-fee charges</p><p className="mt-2 text-2xl font-semibold">{charged.length}</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-400">Pending</p><p className="mt-2 text-2xl font-semibold">{noShows}</p></div>
        </div>
        <div className="mt-12">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Recent kept-fee charges</h2>
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800 text-slate-400"><tr><th className="px-4 py-3 text-left font-medium">Student</th><th className="px-4 py-3 text-left font-medium">Scheduled</th><th className="px-4 py-3 text-left font-medium">Charged</th><th className="px-4 py-3 text-left font-medium">Charge ID</th></tr></thead>
              <tbody className="divide-y divide-slate-800">
                {charged.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">No charges yet.</td></tr>}
                {charged.map((l: any) => (
                  <tr key={l.id}><td className="px-4 py-3">{l.student_name}</td><td className="px-4 py-3 text-slate-400">{new Date(l.scheduled_at).toLocaleString()}</td><td className="px-4 py-3">${((l.charged_cents ?? 0) / 100).toFixed(2)}</td><td className="px-4 py-3 font-mono text-xs text-slate-500">{l.charge_id}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
