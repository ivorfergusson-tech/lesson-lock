# ⚠️ PRE-LAUNCH REMINDER: UI/UX Polish

**Do NOT release until this is done.** The app currently works but the UI is functional, not polished. Before public launch:

## Visual polish
- [ ] Replace default "Create Next App" metadata (title, description, favicon) in layout.tsx
- [ ] Consistent color scheme / brand colors (currently default Tailwind zinc/indigo)
- [ ] Logo + favicon (currently default Next.js favicon)
- [ ] Loading states (spinners/skeletons) on all async pages
- [ ] Empty states with helpful CTAs (not just "No lessons yet.")
- [ ] Error boundaries (friendly error pages, not raw 500s)
- [ ] Mobile responsiveness check (currently desktop-first, verify on phone)
- [ ] Dark mode polish (test all pages in dark mode)

## Navigation & UX
- [ ] Sidebar or top nav (currently just links on dashboard)
- [ ] Breadcrumbs on sub-pages (policy, lessons)
- [ ] Toast notifications instead of `alert()` for charge success/failure
- [ ] Confirmation dialogs for destructive actions (delete policy, mark no-show)
- [ ] Form validation with inline error messages (not just browser defaults)
- [ ] Success/error feedback on all forms (policy save, lesson add, CSV import)
- [ ] Onboarding tooltip tour for first-time users

## Content
- [ ] Replace placeholder text ("Welcome, {email}") with personalized greeting
- [ ] Add help/FAQ section or link to docs
- [ ] Add "Tutor protected" badge asset on booking link
- [ ] Privacy policy + ToS pages (route: /privacy, /terms) — link in footer
- [ ] Footer with links (privacy, terms, support email)

## Performance
- [ ] Image optimization (if adding screenshots/testimonials)
- [ ] Lighthouse audit (aim for 90+ on all metrics)
- [ ] Remove console.log statements

## Accessibility
- [ ] Keyboard navigation (tab order, focus states)
- [ ] ARIA labels on interactive elements
- [ ] Color contrast check (WCAG AA)
- [ ] Screen reader testing

## Before each deploy
- [ ] Run `npm run build -- --webpack` — must pass with 0 errors
- [ ] Test full flow in incognito (signup → policy → book → charge)
- [ ] Check mobile layout on real device

**Owner:** Ivor
**Target:** Before Phase 4 (public launch, Day 61-90)
**Status:** Not started
