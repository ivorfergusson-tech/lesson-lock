import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: policy } = await supabase.from("policies").select("*, tutors(stripe_account_id)").eq("slug", slug).single();
  if (!policy || !policy.tutors?.stripe_account_id) {
    return NextResponse.json({ error: "Policy not found or tutor not connected" }, { status: 404 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const customer = await stripe.customers.create(
    { name: "LessonLock student" },
    { stripeAccount: policy.tutors.stripe_account_id }
  );
  const si = await stripe.setupIntents.create(
    { usage: "off_session", customer: customer.id },
    { stripeAccount: policy.tutors.stripe_account_id }
  );
  return NextResponse.json({ clientSecret: si.client_secret, accountId: policy.tutors.stripe_account_id, tutorId: policy.tutor_id, policyId: policy.id, customerId: customer.id });
}
