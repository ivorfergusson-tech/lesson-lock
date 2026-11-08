import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: tutor } = await supabase.from("tutors").select("stripe_customer_id").eq("id", user.id).single();
  if (!tutor?.stripe_customer_id) return NextResponse.json({ error: "No billing account" }, { status: 400 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const session = await stripe.billingPortal.sessions.create({
    customer: tutor.stripe_customer_id,
    return_url: `${siteUrl}/dashboard`,
  });

  return NextResponse.redirect(session.url, 303);
}
