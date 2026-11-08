import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { lessonId } = await req.json();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const { data: lesson } = await supabase.from("lessons").select("*").eq("id", lessonId).eq("tutor_id", user.id).single();
  if (!lesson) return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  if (lesson.status !== "charged") return NextResponse.json({ error: "Only charged lessons can be refunded" }, { status: 400 });

  const refund = await stripe.refunds.create({ charge: lesson.charge_id });
  await supabase.from("lessons").update({ status: "refunded", charged_cents: 0 }).eq("id", lessonId);

  return NextResponse.json({ ok: true, refundId: refund.id });
}
