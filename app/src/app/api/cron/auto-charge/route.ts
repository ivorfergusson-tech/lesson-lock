import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .in("status", ["no_show", "late_cancel"])
    .lt("scheduled_at", cutoff);

  const results: any[] = [];
  for (const l of lessons ?? []) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/charge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: l.id }),
      });
      const d = await res.json();
      results.push({ id: l.id, ...d });
    } catch (e: any) {
      results.push({ id: l.id, error: e.message });
    }
  }

  return NextResponse.json({ ok: true, processed: results.length, results });
}
