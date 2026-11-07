import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { data: tutor } = await supabase.from("tutors").select("stripe_account_id").eq("id", user.id).single();

  let accountId = tutor?.stripe_account_id;
  if (!accountId) {
    const account = await stripe.accounts.create({ type: "standard", email: user.email ?? undefined });
    accountId = account.id;
    await supabase.from("tutors").update({ stripe_account_id: accountId }).eq("id", user.id);
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?connect=refresh`,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard?connect=return`,
    type: "account_onboarding",
  });

  return NextResponse.redirect(link.url);
}
