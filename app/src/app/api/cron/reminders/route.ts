import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSms } from "@/lib/sms";

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const { data: lessons } = await supabase
    .from("lessons")
    .select("*, tutors(tier, email), policies(cancel_window_hours)")
    .eq("status", "scheduled")
    .gte("scheduled_at", now.toISOString())
    .lte("scheduled_at", in24h.toISOString());

  let sent = 0;
  for (const l of lessons ?? []) {
    if (l.tutors?.tier !== "pro") continue;
    if (!l.student_phone) continue;
    const when = new Date(l.scheduled_at).toLocaleString();
    const ok = await sendSms(l.student_phone, `Reminder: your lesson with your teacher is on ${when}. Reply STOP to opt out.`);
    if (ok) sent++;
  }

  return NextResponse.json({ ok: true, considered: lessons?.length ?? 0, sent });
}
