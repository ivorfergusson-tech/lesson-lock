import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    if (secret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, secret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const tutorId = session.metadata?.tutor_id;
      const tier = session.metadata?.tier || "starter";
      if (tutorId) {
        await supabase.from("tutors").update({
          stripe_customer_id: session.customer as string,
          subscription_status: "active",
          tier,
        }).eq("id", tutorId);
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;
      const status = sub.status === "active" ? "active" : sub.status === "past_due" ? "past_due" : "canceled";
      await supabase.from("tutors").update({ subscription_status: status }).eq("stripe_customer_id", customerId);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await supabase.from("tutors").update({ subscription_status: "canceled", tier: "starter" }).eq("stripe_customer_id", sub.customer as string);
      break;
    }
    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice;
      await supabase.from("tutors").update({ subscription_status: "past_due" }).eq("stripe_customer_id", inv.customer as string);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
