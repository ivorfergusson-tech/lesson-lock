import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: tutor } = await supabase.from("tutors").select("stripe_customer_id, tier").eq("id", user.id).single();
  if (!tutor) return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
  if (tutor.tier !== "pro") return NextResponse.json({ error: "Success fee is for Pro tutors only" }, { status: 403 });
  if (!tutor.stripe_customer_id) return NextResponse.json({ error: "No Stripe customer" }, { status: 400 });

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const { data: charged } = await supabase.from("lessons").select("charged_cents").eq("tutor_id", user.id).eq("status", "charged").gte("created_at", since.toISOString());
  const keptTotal = (charged ?? []).reduce((s: number, l: any) => s + (l.charged_cents ?? 0), 0);
  const feeCents = Math.min(Math.round(keptTotal * 0.05), 4000);
  if (feeCents <= 0) return NextResponse.json({ ok: true, fee: 0, message: "No kept fees in period" });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: tutor.stripe_customer_id,
    amount: feeCents,
    description: "LessonLock Pro success fee (5% of kept fees, capped $40)",
    success_url: `${siteUrl}/dashboard?success_fee=done`,
    cancel_url: `${siteUrl}/dashboard?success_fee=cancel`,
    metadata: { tutor_id: user.id, type: "success_fee" },
  });
  return NextResponse.redirect(session.url, 303);
}
