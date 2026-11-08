import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: tutor } = await supabase.from("tutors").select("stripe_account_id, stripe_onboarded").eq("id", user.id).single();
  const initials = (user.email ?? "U").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      <Header initials={initials} />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <Link href="/dashboard" className="text-slate-400 text-sm hover:text-slate-100">← Back to dashboard</Link>
        <h1 className="text-3xl font-semibold tracking-tight mt-4">Account details</h1>
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div><p className="text-sm text-slate-400">Name</p><p className="mt-1 font-semibold">{user.email}</p></div>
          <div><p className="text-sm text-slate-400">Email</p><p className="mt-1 font-semibold">{user.email}</p></div>
          <div><p className="text-sm text-slate-400">Stripe</p><p className="mt-1 font-semibold text-emerald-400">{tutor?.stripe_account_id ? "Connected ✓" : "Not connected"}</p></div>
          <div><p className="text-sm text-slate-400">Plan</p><p className="mt-1 font-semibold">Starter — $12/mo</p></div>
        </div>
        <form action="/api/auth/signout" method="post" className="mt-6">
          <button className="rounded-full bg-red-500/20 border border-red-400/40 text-red-300 px-6 py-3 font-semibold">Sign out</button>
        </form>
      </main>
    </div>
  );
}
