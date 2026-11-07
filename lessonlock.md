# LessonLock — After-Booking Protection for Solo Tutors

**Verdict: CONDITIONAL GO — Narrow to online music teachers**

## Idea
Booking protection layer for solo 1:1 teachers. Set policy once, students save card, system auto-charges kept fees, sends polite reminders.

## Niche & ICP
Online music teachers (piano / guitar / voice / drums) in US / UK / CA / AU, 10-40 students, $30-80/hr, teaching on Zoom. Desktop-first, Stripe-native.
- Persona: Maya, 37, piano teacher, 22 students online, loses ~4 hrs/wk chasing, $45/hr. Hates awkward texts.

TAM ~2.1M independent 1:1 teachers globally. SAM ~175,000 English-speaking, online, $30-80/hr, ≥10 students, US/UK/CA/AU/EU. SOM: 400 paying tutors in Year 1 (0.23% SAM).

## Problem
10-20% income loss to late cancels / no-shows. Chasing Venmo feels unprofessional and forces tutors to eat it. Existing tools (Calendly + Stripe, Stripe Payment Links, Fresha, Preply/Superprof, HoneyBook) don't enforce policy automatically.
Fresha proves non-salon pros will pay for no-show protection. Tutors' groups constantly post "how do you handle no-shows?" — demand signal real but unconverted.

## Solution
Tutor creates link with policy (free to 24h, 50% kept after). Student checks out once (Stripe Checkout, card saved - SetupIntent, never touch/store card, never hold funds, charges direct to tutor's Stripe). Booking reminders auto-sent. No-show / late cancel auto-charges kept fee, tutor can 1-click refund. Monthly protected-revenue statement + evidence log.
Positioning: "The 2-minute no-show policy for online music teachers — students put a card on file once, you get paid automatically when they flake."

## MVP (scope + stack + timeline)
**Scope:** Auth, 1 policy/link builder, Stripe Checkout save-card, manual lessons table (CSV import), email + SMS reminders (Resend / Twilio), auto-charge engine, refund button + log, simple dashboard.
**Stack:** Next.js 14, Supabase (auth/DB), Stripe, Resend, Twilio, Vercel. ~$110-150/mo.
Alternative: Bubble if won't learn React ($29-119/mo), slower at scale.
**Timeline:** 3 weeks part-time (2 weeks to shippable pilot). Wk1-2: Auth + policy/link builder + Stripe Checkout save-card. Wk3: Lessons table + reminder cron + refund + log.
**What NOT to build:** Calendar sync, Zoom/Google Meet, payment holds/escrow, mobile app, marketplace, multi-currency.

## Pricing & Unit Economics
- Starter $12/mo (40 protected bookings, email reminders)
- Pro $29/mo (unlimited, SMS, custom logo, 5% of kept fees capped $40)

| Assumption | Value |
|---|---|
| Blended ARPU | $17.50 |
| CAC (organic) | $40 |
| Churn | 6%/mo (16.7 mo life) |
| LTV (gross / contribution) | $292 / $218 |
| LTV/CAC | 5.4x |
| Payback | 2.3 mo |
| Costs/mo | ~$150 (Vercel $20, Supabase $25, Resend $20, Twilio $30, domain $15, misc $40) |
| Break-even | 9 tutors |

12-mo projection (MRR incl. success fee):
| Month | Tutors | MRR |
|---|---|---|
| 3 | 12 | $210 |
| 6 | 65 | $1,180 |
| 9 | 140 | $2,600 |
| 12 | 260 | $4,900 |

Pricing psychology: Anchor to recovered fees: "1 kept piano lesson ($45) pays for 4 months." Sell recovery, not software.

## Go-to-Market
**Primary:** Facebook Groups: "Piano Teachers" (150k+), "Guitar Teachers Forum" + r/piano + YouTube Shorts/TikTok: "I made $847 from no-show fees last month [Stripe screenshot]."
**Backup 1:** SEO tools: "no-show policy template for music teachers / tutors" — 20 pages.
**Backup 2:** Integration co-market: Calendly real integrations + teach piano YouTube comment ecosystem.
30-day calendar: Wk1: 30 interviews + landing page. Wk2: 10 concierge pilots. Wk3: 5 Shorts + 20 group posts (value-first). Wk4: 5 paid conversions to $12 pre-auth.
Weekly metrics: Interviews done, landing → email %, pilot card-on-file completion %, protected $ recovered.

Onboarding to first value: 3 steps: 1) Pick policy (24h/50% template) 2) Connect Stripe 3) Copy link → first card-on-file. Target <5 min.
Activation metric: First *paid booking with card saved*, not signup.
Retention loops: Monthly "You protected $X" email + kept-fee ledger she can show parents. Embeds in booking flow.
3 quick wins: 1) Ready-to-send apology/charge template for parents 2) No-show forgiving button (1-click refund) 3) "Tutor protected" badge on link.

## Risks & Mitigations
1. **Low card-on-file completion / parent refusal (30-40% drop-off)** → Mitigate: Test live link with 10 real students pre-build. Require >60% completion. Position as "reserve your spot" not "penalty." Kill gate Day 30.
2. **Churn + summer seasonality (7-8%+) + low moat (Calendly clones)** → Mitigate: Month-to-month + pause, own templates library + group community. Add calendar hook via Zapier post-MVP. Own music-niche positioning.
3. **Chargebacks/disputes & support burden** → Mitigate: Direct-to-tutor Stripe, every auto-charge sends instant email receipt + 1-click refund, evidence log, 24h grace window. Cap automatic charges to $50.

**Kill/pivot gate Day 30:** If <5 paid $12 pre-auth or <60% card capture → KILL or pivot to general solo coaches with same tech.

**Legal:** Use Stripe Connect-style direct charges so not money transmitter. Need: ToS + Privacy (GDPR/CCPA), DPA with Supabase/Twilio, cookie consent, refund-dispute log. SMS: TCPA/ePrivacy — explicit opt-in, STOP. Tax: Stripe sales tax US; UK/EU VAT via Stripe Tax. IP: Copyright policy templates. Flag: Get solicitor review of ToS/Privacy before live charge ($300-600).

## 90-Day Plan
- **Days 1-14:** Interviews, landing page, 10 pasted policy templates, legal ToS via template + review.
- **Days 15-30:** Ship concierge MVP to 10 tutors, measure card capture, iterate templates.
- **Days 31-60:** Convert 5 to paid, publish 15 Shorts, 20 SEO template pages, 3 community webinars in teacher groups.
- **Days 61-90:** Public launch in 3 groups, target 12-20 tutors, $200-350 MRR, collect 10 testimonial "I recovered $X" screenshots. Decide scale/kill.

## Success Metrics
90-Day: 5+ paid pre-auth (gate), 60%+ card-on-file completion, 20+ protected bookings, $1k+ student fees recovered by tutors, <8% monthly churn, 0 chargeback losses to LessonLock.
Confidence: 7/10. Biggest lever: community distribution via piano/guitar groups.
