import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const sp = await searchParams;
  const demo = sp?.demo === "1";
  if (demo) {
    // Render with seeded mock data; no auth/DB.
    const { DEMO_TUTOR, DEMO_LESSONS, DEMO_TOTAL_PROTECTED } = await import("@/lib/demo");
    const charged = DEMO_LESSONS.filter((l: any) => l.status === "charged");
    const noShows = DEMO_LESSONS.filter((l: any) => l.status === "no_show" || l.status === "late_cancel").length;
    // reuse same JSX by falling through? We'll just render a simplified demo dashboard below.
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 px-6 py-10 dark:bg-black">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Welcome, {DEMO_TUTOR.email} (demo).</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Protected revenue recovered</p>
              <p className="mt-2 text-3xl font-semibold">${(DEMO_TOTAL_PROTECTED / 100).toFixed(2)}</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Kept-fee charges</p>
              <p className="mt-2 text-3xl font-semibold">{charged.length}</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <p className="text-sm text-zinc-500">Pending (no-show / late cancel)</p>
              <p className="mt-2 text-3xl font-semibold">{noShows}</p>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="font-semibold">Recent kept-fee charges (evidence log)</h2>
            <div className="mt-3 overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
              <table className="w-full text-sm">
                <thead className="border-b border-black/5 dark:border-white/10">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Student</th>
                    <th className="px-4 py-3 text-left font-medium">Scheduled</th>
                    <th className="px-4 py-3 text-left font-medium">Charged</th>
                    <th className="px-4 py-3 text-left font-medium">Charge ID</th>
                  </tr>
                </thead>
                <tbody>
                  {charged.map((l: any) => (
                    <tr key={l.id} className="border-b border-black/5 dark:border-white/10">
                      <td className="px-4 py-3">{l.student_name}</td>
                      <td className="px-4 py-3">{new Date(l.scheduled_at).toLocaleString()}</td>
                      <td className="px-4 py-3">${((l.charged_cents ?? 0) / 100).toFixed(2)}</td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">{l.charge_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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

  const step1 = (policies ?? []).length > 0;
  const step2 = !!tutor?.stripe_account_id;
  const step3 = (bookings ?? []).length > 0;
  const allDone = step1 && step2 && step3;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 px-6 py-10 dark:bg-black">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Welcome, {user.email}.</p>

        {!allDone && (
          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <h2 className="font-semibold">Get started — 3 steps to your first protected booking</h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3">
                <span className={step1 ? "text-emerald-600" : "text-zinc-400"}>{step1 ? "✓" : "○"}</span>
                <span className={step1 ? "line-through text-zinc-400" : ""}>1. Create a policy</span>
                {!step1 && <Link href="/dashboard/policy" className="ml-auto text-sm text-indigo-600 hover:underline">Go →</Link>}
              </li>
              <li className="flex items-center gap-3">
                <span className={step2 ? "text-emerald-600" : "text-zinc-400"}>{step2 ? "✓" : "○"}</span>
                <span className={step2 ? "line-through text-zinc-400" : ""}>2. Connect Stripe</span>
                {!step2 && <a href="/api/stripe/connect" className="ml-auto text-sm text-indigo-600 hover:underline">Connect →</a>}
              </li>
              <li className="flex items-center gap-3">
                <span className={step3 ? "text-emerald-600" : "text-zinc-400"}>{step3 ? "✓" : "○"}</span>
                <span className={step3 ? "line-through text-zinc-400" : ""}>3. Get a student to save a card on file</span>
                {step1 && step2 && !step3 && <span className="ml-auto text-sm text-zinc-500">Share your policy link →</span>}
              </li>
            </ul>
          </div>
        )}

        {!tutor?.stripe_account_id && (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950">
            <h2 className="font-semibold text-amber-900 dark:text-amber-100">Connect your Stripe account</h2>
            <p className="mt-1 text-sm text-amber-800 dark:text-amber-200">Required before you can save cards or charge kept fees.</p>
            <a href="/api/stripe/connect" className="mt-3 inline-block rounded-full bg-black px-5 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">Connect Stripe</a>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Protected revenue recovered</p>
            <p className="mt-2 text-3xl font-semibold">${(totalProtected / 100).toFixed(2)}</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Kept-fee charges</p>
            <p className="mt-2 text-3xl font-semibold">{charged.length}</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Pending (no-show / late cancel)</p>
            <p className="mt-2 text-3xl font-semibold">{noShows}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Link href="/dashboard/policy" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-zinc-900">
            <h2 className="font-semibold">Policy builder</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Create & manage your no-show policies and shareable links.</p>
          </Link>
          <Link href="/dashboard/lessons" className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-zinc-900">
            <h2 className="font-semibold">Lessons</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Import lessons, mark no-shows, charge kept fees.</p>
          </Link>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold">Recent kept-fee charges (evidence log)</h2>
          <div className="mt-3 overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
            <table className="w-full text-sm">
              <thead className="border-b border-black/5 dark:border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Student</th>
                  <th className="px-4 py-3 text-left font-medium">Scheduled</th>
                  <th className="px-4 py-3 text-left font-medium">Charged</th>
                  <th className="px-4 py-3 text-left font-medium">Charge ID</th>
                </tr>
              </thead>
              <tbody>
                {charged.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-zinc-500">No charges yet.</td></tr>
                )}
                {charged.map((l: any) => (
                  <tr key={l.id} className="border-b border-black/5 dark:border-white/10">
                    <td className="px-4 py-3">{l.student_name}</td>
                    <td className="px-4 py-3">{new Date(l.scheduled_at).toLocaleString()}</td>
                    <td className="px-4 py-3">${((l.charged_cents ?? 0) / 100).toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">{l.charge_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
