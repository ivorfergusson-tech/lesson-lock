"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = (accountId?: string) => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, accountId ? { stripeAccount: accountId } : undefined);

function CheckoutForm({ meta }: { meta: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error, setupIntent } = await stripe.confirmSetup({ elements, redirect: "if_required" });
    if (error) { setMsg(error.message ?? "Failed"); setLoading(false); return; }
    if (setupIntent?.status === "succeeded") {
      const res = await fetch("/api/booking/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        tutorId: meta.tutorId, policyId: meta.policyId, studentName: name, studentEmail: email,
        customerId: meta?.customerId ?? null, paymentMethodId: setupIntent.payment_method, accountId: meta.accountId,
      }) });
      const d = await res.json();
      if (d.ok) { setSaved(true); setMsg("Card saved! You're all set."); } else setMsg(d.error);
    }
    setLoading(false);
  }
  if (saved) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-800/50 bg-emerald-950/40 p-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900/40 text-2xl text-emerald-400">✓</div>
        <h2 className="text-lg font-semibold tracking-tight text-emerald-100">Card saved successfully</h2>
        <p className="mt-1 text-sm text-emerald-300">Your card is on file. You won't be charged unless you late-cancel or no-show.</p>
      </div>
    );
  }
  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500" />
      <input placeholder="Your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500" />
      <PaymentElement />
      <button disabled={!stripe || loading} className="w-full rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-500">
        {loading ? "Saving…" : "Save card on file"}
      </button>
      {msg && <p className="text-sm text-slate-400">{msg}</p>}
    </form>
  );
}

export default function BookPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [clientSecret, setClientSecret] = useState("");
  const [meta, setMeta] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    fetch("/api/stripe/setup-intent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) })
      .then((r) => r.json())
      .then((d) => { if (d.error) { console.error("setup-intent error:", d.error); } setClientSecret(d.clientSecret || ""); setMeta(d); })
      .catch((e) => console.error("fetch failed:", e));
  }, [slug]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 font-sans text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-sm">
        <span className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-slate-100"><img src="/logo.svg" alt="LessonLock" className="w-7 h-7" />LessonLock</span>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Save your card on file</h1>
        <p className="mt-2 text-sm text-slate-400">Your teacher requires a card to reserve lessons. You won't be charged unless you late-cancel or no-show.</p>
        {clientSecret ? (
          <Elements stripe={stripePromise(meta?.accountId)} options={{ clientSecret, appearance: { theme: "night", variables: { colorPrimary: "#2563eb", colorBackground: "#0f172a", colorText: "#e2e8f0", colorDanger: "#ef4444", borderRadius: "8px" } } }}>
            <CheckoutForm meta={meta} />
          </Elements>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Loading payment form… (if this stays, check browser console)</p>
        )}
      </div>
    </div>
  );
}
