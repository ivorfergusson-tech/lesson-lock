import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const PRICES = {
  starter: process.env.STRIPE_STARTER_PRICE_ID || "",
  pro: process.env.STRIPE_PRO_PRICE_ID || "",
};

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let tier = "starter";
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const body = await req.json();
      tier = body.tier || "starter";
    } else {
      const form = await req.formData();
      tier = (form.get("tier") as string) || "starter";
    }
  } catch {}
  const priceId = PRICES[tier as keyof typeof PRICES];
  if (!priceId) return NextResponse.json({ error: "Price not configured" }, { status: 500 });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { data: tutor } = await supabase.from("tutors").select("stripe_customer_id").eq("id", user.id).single();

  let customerId = tutor?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email ?? undefined, metadata: { tutor_id: user.id } });
    customerId = customer.id;
    await supabase.from("tutors").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?checkout=success`,
    cancel_url: `${siteUrl}/dashboard?checkout=cancel`,
    metadata: { tutor_id: user.id, tier },
  });

  if (!session.url) return NextResponse.json({ error: "No redirect URL returned from Stripe" }, { status: 500 });
  return NextResponse.redirect(session.url, 303);
}
