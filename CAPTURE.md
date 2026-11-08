# LessonLock — Capture Guide (Self-Serve Demo Clips)

## DEMO MODE (coordinate with coder to implement)

**Goal:** let the marketing team capture real product footage without real auth, Stripe, or side effects.

**Spec (to be implemented by coder):**
- Trigger: append `?demo=1` to any URL, or open `/demo` (redirects to `/dashboard?demo=1`).
- Seeds realistic mock data (Maya persona, 22 students, $45/hr, Zoom):
  - Tutor profile: Maya Chen, piano, 22 students, $45/hr.
  - 1 policy: "24h notice / 50% kept fee", shareable link.
  - 6 lessons: 3 completed, 2 no-show (charged $45 + $45), 1 late cancel (charged $22.50).
  - Stripe status: onboarded (mock), protected revenue recovered $112.50.
  - Evidence log: 3 charged rows with fake charge IDs (`ch_demo_...`).
- Disables: real Supabase auth (auto-login as demo tutor), Stripe calls (mocked), email/SMS sends (logged to console only), DB writes (in-memory only, resets on reload).
- Banner: top banner "DEMO MODE — data is mock, resets on reload".
- Document in `app/README.md` under "Demo mode".

**Status:** not yet implemented. Until then, capture from a seeded test account or use text-on-screen fallback.

## Capture tooling
- Suggested: OBS Studio (desktop), QuickTime (Mac), phone screen record (mobile viewport).
- Region: 1080×1920 (9:16) for TikTok/Reels/Shorts; 1200×628 for LinkedIn thumbnails.
- Frame rate: 30fps. Audio: record voiceover separately or use system audio.

## Fallback (no recording possible)
For every clip, a "text-on-screen" version is provided: a static carousel of 3-5 text cards that conveys the same message and CTA, postable as image slides.

## Headless capture
No Playwright/Puppeteer in project. If added later, snippet:
```js
// capture.mjs (Playwright)
import { chromium } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 } });
const page = await ctx.newPage();
await page.goto('http://localhost:3000/dashboard?demo=1');
await page.waitForTimeout(1000);
await page.screenshot({ path: 'clip-dashboard.png', fullPage: false });
await browser.close();
```

## Per-clip capture index
See MARKETING-PLAN.md §7 "CAPTURE BLOCKS per clip".
