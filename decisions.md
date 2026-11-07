# LessonLock — Architecture & Product Decisions (pre-build)

Resolved from `unclear-areas.md` items 1-4, 5-7, 28. These decisions unblock building the MVP.

## 1. Stripe architecture (unclear #4) — DECIDED
**Model:** Stripe Connect with **Standard connected accounts**, direct charges.

- Tutors connect their own Stripe account via Connect OAuth. LessonLock never holds funds, never stores cards, never is a money transmitter.
- Student cards are saved on the tutor's Stripe account (SetupIntent via Connect). Auto-charges are created by LessonLock using the tutor's connected account credentials.
- LessonLock's own revenue (subscriptions + success fees) is billed to the tutor on LessonLock's platform Stripe account, separate from student charges.
- **Legal gate:** Solicitor must confirm ToS/Privacy framing ("software provider, not payment processor") before live charges. ($300-600 budgeted.)

## 2. Concierge MVP (unclear #1) — DECIDED
"Concierge" = **white-glove onboarding**, not manual charging.
- The auto-charge engine, reminders, refund button, and evidence log ARE built in MVP.
- You (founder) manually onboard each of the 10 pilot tutors: set up their policy + link, walk them through Stripe Connect, import their lessons CSV.
- Pilot tutors do not self-serve signup in Days 15-30. Self-serve onboarding lands in Phase 3.

## 3. No-show / late-cancel detection (unclear #2) — DECIDED
**Trigger:** Tutor marks a lesson as no-show or late-cancel via dashboard button (or CSV status column on import).
- Charge fires **after a 24h grace window** to allow the tutor to forgive (1-click refund before charge).
- Before charging, system sends an automatic, polite email to the parent with the policy text + receipt link + refund contact.
- **Evidence log** records: lesson ID, scheduled time, mark timestamp, policy text snapshot, charge ID, receipt URL, parent comms timestamps, refund (if any).
- Cap per charge: **$50** (see #8). Tutors charging >$50/hr handle overage manually.

## 4. Booking ingestion (unclear #3) — DECIDED
- **MVP: manual only.** Lessons entered via dashboard or CSV import. No calendar sync (explicitly out of scope).
- Reminder reliability depends on tutor discipline; mitigated by CSV import template + "add lesson" shortcut + monthly nudge.
- Post-MVP: Zapier calendar hook (Phase 4 exploration).

## 5. Pre-auth $12 (unclear #5) — DECIDED
$12 = **first month of Starter**, charged as a setup/pre-auth that converts to an active monthly subscription on activation (first protected booking with card saved).
- Not a deposit/hold on student funds. Not a setup fee separate from subscription.
- Kill-gate metric counts tutors who complete this pre-auth.

## 6. Success fee (unclear #6) — DECIDED
- Pro tier: 5% of kept fees, **capped $40/month**.
- Collected **monthly via Stripe invoice** to the tutor (not deducted from student charges). Transparent line item.
- Trigger: monthly, based on auto-charges marked "kept fee" in the prior month.

## 7. Multi-currency (unclear #7) — DECIDED
- LessonLock subscription billing: **USD only**.
- Student charges: occur in the tutor's Stripe local currency (Connect handles FX). No multi-currency pricing for MVP.
- Tutors in UK/AU/CA charge students in local currency; LessonLock bills them $12/$29.

## 8. Charge cap (unclear #28) — DECIDED
- Auto-charge cap: **$50 per charge** (risk mitigation for disputes).
- Tutors with rates >$50/hr: cap documented in onboarding; overage charged manually outside LessonLock.
- Conflict acknowledged: a full kept lesson at $80/hr exceeds cap. Decision: cap wins for auto-charge; tutor keeps right to invoice remainder manually. Revisit if pilots complain.

## 9. Churn target (unclear #11) — DECIDED
- Single target: **<8%/mo** (aligns with success metric). Unit economics 6% was aspirational; use 8% for planning, aim for 6%.

## 10. SOM vs projection (unclear #12) — DECIDED
- SOM statement (400 paying tutors Year 1) is the **aspiration/ceiling**; 12-month MRR table (260 tutors) is the **planning baseline**. Use 260 for financial planning, 400 for investor narrative.

## Still open (resolve during build)
- Evidence log exact fields (#8) — drafted in #3 above, refine in code.
- Monthly protected-revenue statement format (#9) — Phase 4.
- "Protected booking" definition for 20+ metric (#10) — any lesson with card on file that was charged or completed.
- Tax responsibility split (#21) — solicitor + Stripe Tax decision.
- SMS TCPA/ePrivacy (#22) — opt-in + STOP handling in Twilio setup.
- Cookie consent / DPA (#23), refund policy text (#24), IP on templates (#25) — legal phase.
- Custom logo scope (#26), pause subscription proration (#27), onboarding UX (#30) — Phase 3.

## Recommendation
Items 1-8 and 9-10 resolved. Safe to start building MVP (Phase 2). Legal gates (#21-25) must close before live charges (Day ~30).
