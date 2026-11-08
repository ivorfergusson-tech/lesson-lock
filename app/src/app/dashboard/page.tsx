import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ demo?: string; connect?: string }> }) {
  const sp = await searchParams;
  const demo = sp?.demo === "1";
  const connectStatus = sp?.connect;

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
  const { data: policies } = await supabase.from("policies").select("id, name, slug").eq("tutor_id", user.id);
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
        {connectStatus === "return" && (
          <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            Stripe connected successfully. You can now save cards and charge kept fees.
          </div>
        )}
        {connectStatus === "refresh" && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            Stripe onboarding was interrupted. Click "Connect Stripe" to resume.
          </div>
        )}
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
              <li className="flex items-center gap-3"><span className={((bookings ?? []).length > 0 || charged.length > 0) ? "text-emerald-400" : "text-slate-500"}>{((bookings ?? []).length > 0 || charged.length > 0) ? "✓" : "○"}</span><span className={((bookings ?? []).length > 0 || charged.length > 0) ? "line-through text-slate-500" : ""}>3. Get a student to save a card on file</span></li>
            </ul>
          </div>
        )}
        {!tutor?.stripe_account_id && (
          <details className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <summary className="cursor-pointer font-semibold text-blue-400">How to connect Stripe (instructions)</summary>
            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <p>1. Click "Connect Stripe" above. You'll be taken to Stripe's secure onboarding.</p>
              <p>2. Select <strong>Individual / Sole proprietor</strong> (not Company).</p>
              <p>3. Use your personal email and your own name as the business name.</p>
              <p>4. For "Business website", paste your LessonLock booking link or a social profile (Instagram/YouTube). If it's optional, you can skip it.</p>
              <p>5. Enter your personal bank account for payouts.</p>
              <p>6. Verify your phone via SMS and email.</p>
              <p>7. After finishing, you'll be redirected back to this dashboard automatically.</p>
              <p className="text-slate-500">Test mode: use test data — no real money moves. Switch to live keys later.</p>
            </div>
          </details>
        )}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-400">Protected revenue</p><p className="mt-2 text-2xl font-semibold text-emerald-400">${(totalProtected / 100).toFixed(2)}</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-400">Kept-fee charges</p><p className="mt-2 text-2xl font-semibold">{charged.length}</p></div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"><p className="text-sm text-slate-400">Pending</p><p className="mt-2 text-2xl font-semibold">{noShows}</p></div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Recent lessons</h2>
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-800 text-slate-400"><tr><th className="px-4 py-3 text-left font-medium">Student</th><th className="px-4 py-3 text-left font-medium">Scheduled</th><th className="px-4 py-3 text-left font-medium">Status</th><th className="px-4 py-3 text-left font-medium">Charged</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {(lessons ?? []).length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">No lessons yet.</td></tr>}
                  {(lessons ?? []).slice(0, 6).map((l: any) => (
                    <tr key={l.id}><td className="px-4 py-3">{l.student_name}</td><td className="px-4 py-3 text-slate-400">{new Date(l.scheduled_at).toLocaleString()}</td><td className="px-4 py-3 text-slate-400">{l.status}</td><td className="px-4 py-3">${((l.charged_cents ?? 0) / 100).toFixed(2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Share your booking link</h2>
            {(policies ?? []).length > 0 ? (
              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                {(policies ?? []).slice(0, 1).map((p: any) => {
                  const link = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"}/book/${p.slug}`;
                  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(link)}`;
                  return (
                    <div key={p.id} className="space-y-3">
                      <p className="text-sm text-slate-300">{p.name}</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 truncate rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200">{link}</code>
                      </div>
                      <div className="flex items-center gap-4">
                        <img src={qr} alt="QR code" className="h-32 w-32 rounded-lg border border-slate-700 bg-white p-1" />
                        <p className="text-xs text-slate-500">Scan to open the booking page and save a card on file.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-400">
                Create a policy first to get a shareable booking link.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
