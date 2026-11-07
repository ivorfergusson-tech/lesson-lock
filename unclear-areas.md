# LessonLock — Unclear / Under-specified Areas in lessonlock.md

Items below are gaps, contradictions, or undefined terms in the plan. Resolve before building.

## Product / mechanics
1. **"Concierge MVP" undefined.** Days 15-30 says "ship concierge MVP to 10 tutors" — is the product automated or are you manually running charges behind the scenes? Affects build scope.
2. **No-show detection trigger.** MVP includes "manual lessons table (CSV import)" and auto-charge on no-show/late cancel, but never defines who/what marks a lesson as no-show, or the evidence required before charging. Critical path.
3. **Booking ingestion.** "Booking reminders auto-sent" but calendar sync is explicitly NOT built and only manual lessons table exists. How do bookings enter the system? Manual entry only → reminder reliability depends on tutor discipline.
4. **Stripe architecture contradiction.** Solution says "charges direct to tutor's Stripe" and legal says "Stripe Connect-style direct charges so not money transmitter." Is LessonLock a Connect platform charging on tutors' behalf, or software triggering charges with tutor's own API keys? Security/compliance implications differ hugely. Needs a decision + solicitor input.
5. **"Pre-auth" $12.** "5 paid conversions to $12 pre-auth" — is $12 a deposit/hold, first month, or setup fee? Undefined.
6. **Success fee trigger.** Pro includes "5% of kept fees capped $40" — charged when? On each auto-charge? Monthly? How collected (Stripe invoice vs deducted)?
7. **Multi-currency.** Targets US/UK/CA/AU but "multi-currency" is in "what NOT to build." Are all prices/charges USD only? Tutors in UK/AU charging in local currency?
8. **Evidence log contents.** "evidence log" and "refund-dispute log" referenced; no spec of what's recorded (timestamps, policy text, charge ID, receipt, parent comms).
9. **Monthly protected-revenue statement** format/delivery undefined.
10. **"Protected booking" definition** for the 20+ success metric undefined.

## Business / metrics
11. **Churn inconsistency.** Unit economics says 6%/mo; success metric says <8%/mo. Pick one target.
12. **SOM vs projection mismatch.** SOM stated as 400 paying tutors in Year 1, but 12-month MRR table ends at 260 tutors. Reconcile.
13. **"Piano Teachers 150k+" group size** and other audience numbers unverified.
14. **Break-even 9 tutors** uses $150/mo costs, but solicitor review ($300-600) and any paid ads aren't in the $150/mo cost stack. Add legal + contingency.
15. **Confidence 7/10** with no stated basis/risk weighting.

## GTM / content
16. **"10 pasted policy templates"** (Days 1-14) — "pasted" ambiguous: copy-paste templates? Into what? Need the 10 actual template texts.
17. **"Calendly real integrations"** (Backup 2) — typo/unclear; probably "Calendly integration" or co-marketing.
18. **"20 SEO template pages"** — no keyword list or page structure.
19. **"3 community webinars"** — format, platform, conversion goal undefined.
20. **"5 Shorts + 20 group posts (value-first)"** — content scripts not drafted.

## Legal / compliance
21. **Tax responsibility split.** Stripe Tax for US/UK/EU VAT on tutor subscriptions, but student charges are tutor's revenue. Who remits what? Unclear.
22. **SMS TCPA/ePrivacy** opt-in flow and STOP handling not specified; Twilio sender registration (A2P 10DLC) not mentioned.
23. **Cookie consent / DPA** with Supabase/Twilio/Resend — scope of data shared undefined.
24. **Refund policy text** for parents (dispute handling) not drafted.
25. **IP/copyright** on policy templates — who owns, licensing not defined.

## Scope / product
26. **"Custom logo" on Pro** — scope (white-label link?) undefined.
27. **"Pause subscription"** (retention) — proration/refund rules undefined.
28. **Cap "automatic charges to $50"** vs tutors charging $30-80/hr → a full kept lesson may exceed cap. Conflict with pricing. Decide cap or per-lesson full fee.
29. **"Forgiving button" (1-click refund)** — partial vs full refund, and whether it auto-notifies parent undefined.
30. **Onboarding "<5 min"** — no step-by-step UX spec beyond 3 steps.

## Recommendation
Resolve items 1-4 and 28 before writing any code; they change architecture. Items 11-12 before financial planning. Rest can be resolved during build.
