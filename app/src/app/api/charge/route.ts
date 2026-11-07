import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { sendChargeReceipt } from "@/lib/email";

// Charge kept fee for a lesson marked no_show/late_cancel older than 24h grace.
export async function POST(req: NextRequest) {
  const { lessonId } = await req.json();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: lesson } = await supabase.from("lessons").select("*, tutors(stripe_account_id), policies(kept_fee_percent, cap_cents)").eq("id", lessonId).single();
  if (!lesson) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (!["no_show", "late_cancel"].includes(lesson.status)) return NextResponse.json({ error: "not chargeable" }, { status: 400 });

  const acct = lesson.tutors?.stripe_account_id;
  if (!acct) return NextResponse.json({ error: "tutor not connected" }, { status: 400 });

  // find saved payment method via protected_bookings by student email
  const { data: booking } = await supabase.from("protected_bookings").select("*").eq("tutor_id", lesson.tutor_id).eq("student_email", lesson.student_email).order("created_at", { ascending: false }).limit(1).single();
  if (!booking?.stripe_payment_method_id) return NextResponse.json({ error: "no saved card" }, { status: 400 });

  const keptPct = lesson.policies?.kept_fee_percent ?? 50;
  const cap = lesson.policies?.cap_cents ?? 5000;
  let amount = Math.round(lesson.rate_cents * (keptPct / 100));
  if (amount > cap) amount = cap;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  try {
    const pi = await stripe.paymentIntents.create(
      {
        amount,
        currency: "usd",
        customer: booking.stripe_customer_id ?? undefined,
        payment_method: booking.stripe_payment_method_id,
        off_session: true,
        confirm: true,
        description: `LessonLock kept fee — ${lesson.student_name}`,
      },
      { stripeAccount: acct }
    );
    await supabase.from("lessons").update({ status: "charged", charge_id: pi.id, charged_cents: amount }).eq("id", lesson.id);
    const policyText = `Cancel window: ${lesson.policies?.cancel_window_hours ?? 24}h · Kept fee: ${lesson.policies?.kept_fee_percent ?? 50}% · Cap: $${((lesson.policies?.cap_cents ?? 5000) / 100).toFixed(2)}`;
    await sendChargeReceipt({
      to: lesson.student_email,
      studentName: lesson.student_name,
      amountCents: amount,
      policyText,
      chargeId: pi.id,
    });
    return NextResponse.json({ ok: true, chargeId: pi.id, amount });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
