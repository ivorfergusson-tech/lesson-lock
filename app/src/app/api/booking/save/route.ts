import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { tutorId, policyId, studentName, studentEmail, customerId, paymentMethodId, accountId } = await req.json();
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { error } = await supabase.from("protected_bookings").insert({
    tutor_id: tutorId,
    policy_id: policyId,
    student_name: studentName,
    student_email: studentEmail,
    stripe_customer_id: customerId,
    stripe_payment_method_id: paymentMethodId,
    stripe_account_id: accountId,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
