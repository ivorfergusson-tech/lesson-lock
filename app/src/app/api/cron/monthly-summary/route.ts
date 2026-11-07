import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  const { data: tutors } = await supabase.from("tutors").select("id, email");
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let sent = 0;
  for (const t of tutors ?? []) {
    const { data: lessons } = await supabase
      .from("lessons")
      .select("charged_cents, student_name")
      .eq("tutor_id", t.id)
      .eq("status", "charged")
      .gte("scheduled_at", since);

    const total = (lessons ?? []).reduce((s: number, l: any) => s + (l.charged_cents ?? 0), 0);
    if (total === 0 || !t.email) continue;

    if (resend) {
      try {
        await resend.emails.send({
          from: "LessonLock <summary@lessonlock.com>",
          to: t.email,
          subject: `You protected $${(total / 100).toFixed(2)} this month`,
          html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2>You protected $${(total / 100).toFixed(2)} this month</h2>
            <p>${lessons?.length ?? 0} kept-fee charge(s) recovered automatically.</p>
            <p style="color:#a1a1aa;font-size:12px;margin-top:24px">LessonLock — booking protection for music teachers.</p>
          </div>`,
        });
        sent++;
      } catch (e) {
        console.error("[monthly-summary] send failed:", e);
      }
    } else {
      console.log(`[monthly-summary] (no key) would send to ${t.email}: $${(total / 100).toFixed(2)}`);
      sent++;
    }
  }

  return NextResponse.json({ ok: true, tutors: tutors?.length ?? 0, sent });
}
