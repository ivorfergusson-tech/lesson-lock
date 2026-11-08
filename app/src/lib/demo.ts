export const DEMO_TUTOR = {
  name: "Maya Chen",
  email: "maya@lessonlock.demo",
  instrument: "Piano",
  students: 22,
  rate: 45,
};

export const DEMO_LESSONS = [
  { id: "l1", student_name: "Emma R.", scheduled_at: "2026-11-02T16:00:00Z", status: "completed", charged_cents: 0 },
  { id: "l2", student_name: "Liam P.", scheduled_at: "2026-11-03T17:00:00Z", status: "completed", charged_cents: 0 },
  { id: "l3", student_name: "Olivia K.", scheduled_at: "2026-11-04T18:00:00Z", status: "completed", charged_cents: 0 },
  { id: "l4", student_name: "Noah T.", scheduled_at: "2026-11-05T16:00:00Z", status: "no_show", charged_cents: 4500, charge_id: "ch_demo_001" },
  { id: "l5", student_name: "Ava M.", scheduled_at: "2026-11-06T17:00:00Z", status: "no_show", charged_cents: 4500, charge_id: "ch_demo_002" },
  { id: "l6", student_name: "Ethan B.", scheduled_at: "2026-11-07T18:00:00Z", status: "late_cancel", charged_cents: 2250, charge_id: "ch_demo_003" },
];

export function isDemo(searchParams?: { demo?: string } | null) {
  return searchParams?.demo === "1";
}

export const DEMO_TOTAL_PROTECTED = DEMO_LESSONS.reduce((s, l) => s + (l.charged_cents ?? 0), 0);
