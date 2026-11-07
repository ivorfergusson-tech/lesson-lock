# LessonLock — 90-Day Execution Checklist

Verdict context: CONDITIONAL GO, narrowed to online music teachers. Kill/pivot gate at Day 30.

## Phase 0 — Prep (Days 0-2)
- [ ] Confirm niche: online music teachers (piano/guitar/voice/drums), US/UK/CA/AU, 10-40 students, $30-80/hr, Zoom-based.
- [ ] Decide legal entity + banking for Stripe (sole trader/LLC).
- [ ] Buy domain, set up email (Resend sender domain).
- [ ] Create GitHub repo; decide monorepo vs single app.
- [ ] Set up Supabase project (auth + DB) and Stripe test account.

## Phase 1 — Validate Demand (Days 1-14)
### Interviews (target 30)
- [ ] Build 1-page interview script: current no-show rate, how they handle it, tools used, willingness to require card-on-file.
- [ ] Recruit from "Piano Teachers" FB group, "Guitar Teachers Forum", r/piano, teacher Discords.
- [ ] Log each interview in a sheet: name, students, rate, no-show %, pain score, card-on-file reaction, quote.
- [ ] Kill-gate pre-check: if <50% say they'd require card-on-file → revisit positioning.

### Landing page
- [ ] Write hero: "The 2-minute no-show policy for online music teachers — students put a card on file once, you get paid automatically when they flake."
- [ ] Include recovered-fee anchor: "1 kept piano lesson ($45) pays for 4 months."
- [ ] Email capture + "I want early access" CTA.
- [ ] Deploy to Vercel; share link in 3 groups (value-first, not spam).
- [ ] Track landing → email % (target meaningful, e.g. >5%).

### Policy templates (10)
- [ ] Draft 10 ready-to-use policy templates (24h/50%, 48h/100%, first-lesson-free, etc.).
- [ ] Include "ready-to-send apology/charge template for parents".
- [ ] "Tutor protected" badge asset.

### Legal (start early)
- [ ] Draft ToS + Privacy (GDPR/CCPA) using template.
- [ ] Cookie consent banner plan.
- [ ] DPA checklist with Supabase/Twilio/Resend.
- [ ] SMS opt-in + STOP handling plan (TCPA/ePrivacy).
- [ ] Book solicitor review ($300-600) before live charges.
- [ ] Stripe Tax setup decision (US sales tax; UK/EU VAT).

## Phase 2 — Concierge MVP (Days 15-30)
### Build (Next.js 14 + Supabase + Stripe)
- [ ] Auth (Supabase): email + magic link, tutor profile.
- [ ] Policy/link builder: pick template, customize window + kept %, generate shareable link.
- [ ] Stripe Checkout (SetupIntent) to save card; never store card; direct charges to tutor's Stripe.
- [ ] Manual lessons table + CSV import.
- [ ] Mark no-show / late-cancel → auto-charge kept fee (capped $50).
- [ ] 1-click refund button.
- [ ] Evidence log (timestamps, policy, charge, receipt).
- [ ] Email reminders (Resend); SMS (Twilio) behind Pro flag.
- [ ] Simple dashboard: protected $ recovered, kept-fee ledger.

### Pilot
- [ ] Onboard 10 tutors manually (concierge: you set up their policy + link).
- [ ] Get 10 real students to complete card-on-file via a live link.
- [ ] Measure card-on-file completion % (target >60%).
- [ ] Iterate policy templates based on parent friction.
- [ ] Collect 3 "I recovered $X" quotes.

### Kill gate (Day 30)
- [ ] Check: ≥5 paid $12 pre-auth? ≥60% card capture?
- [ ] If NO → KILL or pivot to general solo coaches with same tech.
- [ ] If YES → proceed to Phase 3.

## Phase 3 — Convert & Publish (Days 31-60)
- [ ] Convert 5 pilots to paid ($12/mo).
- [ ] Publish 15 YouTube Shorts/TikTok: "I made $X from no-show fees last month [Stripe screenshot]".
- [ ] Publish 20 SEO template pages: "no-show policy template for music teachers / tutors".
- [ ] Run 3 community webinars in teacher groups.
- [ ] Add monthly "You protected $X" email + kept-fee ledger export for parents.
- [ ] Add "pause subscription" + month-to-month billing.
- [ ] Refine onboarding to <5 min: pick policy → connect Stripe → copy link → first card-on-file.
- [ ] Activation metric tracking: first paid booking with card saved (not signup).

## Phase 4 — Public Launch (Days 61-90)
- [ ] Public launch in 3 FB groups (value-first posts).
- [ ] Target 12-20 paying tutors, $200-350 MRR.
- [ ] Collect 10 testimonial "I recovered $X" screenshots.
- [ ] Monthly protected-revenue statement feature.
- [ ] Zapier calendar hook (post-MVP) exploration.
- [ ] Decide: scale vs kill.

## Success metrics (90-day)
- [ ] 5+ paid pre-auth (gate)
- [ ] 60%+ card-on-file completion
- [ ] 20+ protected bookings
- [ ] $1k+ student fees recovered by tutors
- [ ] <8% monthly churn
- [ ] 0 chargeback losses to LessonLock

## Weekly metrics to track
- Interviews done
- Landing → email %
- Pilot card-on-file completion %
- Protected $ recovered
- MRR, churn, payback
